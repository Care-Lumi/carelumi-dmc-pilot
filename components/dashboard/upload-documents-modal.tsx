"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Edit2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { useClickTracker } from "@/lib/hooks/use-click-tracker"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface UploadDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (classification: any) => void
}

export function UploadDocumentsModal({ isOpen, onClose, onUploadComplete }: UploadDocumentsModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "results" | "saving" | "success" | "error">(
    "idle",
  )
  const [classification, setClassification] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [previewRotation, setPreviewRotation] = useState(0) // Added rotation state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const [editedType, setEditedType] = useState("")
  const [editedOwnerName, setEditedOwnerName] = useState("")
  const [editedOwnerType, setEditedOwnerType] = useState<"staff" | "facility" | "payer" | "organization">("staff")
  const [editedLicenseNumber, setEditedLicenseNumber] = useState("")
  const [editedExpiration, setEditedExpiration] = useState("")
  const [editedJurisdiction, setEditedJurisdiction] = useState("")

  const [duplicateCheck, setDuplicateCheck] = useState<{
    isDuplicate: boolean
    isRenewal?: boolean
    isHistorical?: boolean
    existingDocument?: any
    documentToMarkHistorical?: string
  } | null>(null)

  const { toast } = useToast()
  const { trackClick } = useClickTracker()

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([])
      setUploadStatus("idle")
      setClassification(null)
      setErrorMessage("")
      setIsEditing(false)
      setDuplicateCheck(null)
      setFilePreviewUrl(null)
      setPreviewZoom(1)
      setPreviewRotation(0) // Reset rotation
      setNumPages(null)
      setPageNumber(1)
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedFiles.length > 0 && currentFileIndex < selectedFiles.length) {
      const file = selectedFiles[currentFileIndex]
      const url = URL.createObjectURL(file)
      setFilePreviewUrl(url)
      setPreviewZoom(1)
      setPreviewRotation(0) // Reset rotation when file changes
      setPageNumber(1)

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [selectedFiles, currentFileIndex])

  if (!isOpen) return null

  const resetModal = () => {
    setSelectedFiles([])
    setCurrentFileIndex(0)
    setUploadStatus("idle")
    setClassification(null)
    setErrorMessage("")
    setIsEditing(false)
    setDuplicateCheck(null)
    setFilePreviewUrl(null)
    setPreviewZoom(1)
    setPreviewRotation(0) // Reset rotation
    setNumPages(null)
    setPageNumber(1)
    setPdfLoading(true)
    setPdfError(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files))
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    trackClick("upload_documents_clicked", { file_count: selectedFiles.length })
    await processFile(selectedFiles[currentFileIndex])
  }

  const processFile = async (file: File) => {
    setUploadStatus("processing")
    setErrorMessage("")
    setIsEditing(false)
    setDuplicateCheck(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("[v0] Sending file to classify-document API:", file.name)
      const response = await fetch("/api/classify-document", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Classification API response status:", response.status)
      const result = await response.json()
      console.log("[v0] Classification API response body:", result)

      if (!response.ok) {
        const errorMessage =
          result.details || result.error || "Unable to process document. AI services may be temporarily unavailable."
        console.error("[v0] Classification failed with error:", errorMessage)

        toast({
          title: "Classification Failed",
          description: errorMessage,
          variant: "destructive",
        })
        setUploadStatus("error")
        setErrorMessage(errorMessage)
        return
      }

      setClassification(result)

      console.log("[v0] Full Gemini classification result:", JSON.stringify(result, null, 2))

      const classification = result.classification || result
      const identifiers = classification.identifiers || {}
      const validity = classification.validity || {}
      const jurisdiction = classification.jurisdiction || {}

      console.log("[v0] Checking for name in these fields:", {
        ownerName: result.ownerName,
        personName: result.personName,
        entityName: result.entityName,
        providerName: identifiers.providerName,
        name: result.name,
        licensee: result.licensee,
        holderName: result.holderName,
      })

      const extractedName =
        result.ownerName ||
        result.personName ||
        result.entityName ||
        identifiers.providerName ||
        result.name ||
        result.licensee ||
        result.holderName ||
        ""

      console.log("[v0] Extracted owner name:", extractedName)

      setEditedType(classification.documentType || result.docType || "")
      setEditedOwnerName(extractedName)
      setEditedLicenseNumber(identifiers.licenseNumber || result.licenseNumber || result.certificateNumber || "")
      setEditedExpiration(validity.expirationDate || result.expirationDate || result.expiresAt || "")
      setEditedJurisdiction(jurisdiction.state || result.jurisdiction || result.state || "")

      const detectedType = detectOwnerType(classification.documentType || result.docType || "")
      setEditedOwnerType(detectedType)

      const extractedLicenseNumber = identifiers.licenseNumber || result.licenseNumber || result.certificateNumber || ""
      const extractedExpiration = validity.expirationDate || result.expirationDate || result.expiresAt || ""

      if (extractedLicenseNumber && extractedName) {
        await checkForDuplicates(
          extractedLicenseNumber,
          extractedName,
          classification.documentType || result.docType || "",
          extractedExpiration,
        )
      }

      setUploadStatus("results")
    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to process document")
    }
  }

  const checkForDuplicates = async (
    licenseNumber: string,
    ownerName: string,
    docType: string,
    expirationDate: string,
  ) => {
    try {
      console.log("[v0] Checking for duplicates with:", { licenseNumber, ownerName, docType, expirationDate })
      const response = await fetch("/api/documents/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseNumber, ownerName, docType, expirationDate }),
      })

      const contentType = response.headers.get("content-type")
      console.log("[v0] Duplicate check response status:", response.status, "content-type:", contentType)

      if (!contentType?.includes("application/json")) {
        console.error("[v0] Duplicate check returned non-JSON response:", contentType)
        const text = await response.text()
        console.error("[v0] Response body (first 500 chars):", text.substring(0, 500))
        return
      }

      const data = await response.json()
      console.log("[v0] Duplicate check response data:", data)

      if (data.error) {
        console.error("[v0] Duplicate check API error:", data.error, data.details)
        return
      }

      setDuplicateCheck(data)
      if (data.isDuplicate) {
        console.log("[v0] Duplicate document found:", data.existingDocument)
      } else if (data.isRenewal) {
        console.log("[v0] Renewal detected, will mark old doc as historical:", data.documentToMarkHistorical)
      } else if (data.isHistorical) {
        console.log("[v0] Historical upload detected, will save as historical")
      }
    } catch (error) {
      console.error("[v0] Error checking for duplicates:", error)
    }
  }

  const detectOwnerType = (docType: string): "staff" | "facility" | "payer" | "organization" => {
    const docTypeLower = docType.toLowerCase()
    if (docTypeLower.includes("facility") || docTypeLower.includes("building")) {
      return "facility"
    } else if (
      docTypeLower.includes("payer") ||
      docTypeLower.includes("contract") ||
      docTypeLower.includes("agreement")
    ) {
      return "payer"
    } else if (
      docTypeLower.includes("license") ||
      docTypeLower.includes("certification") ||
      docTypeLower.includes("credential")
    ) {
      return "staff"
    } else {
      return "organization"
    }
  }

  const handleSaveChanges = async () => {
    try {
      const file = selectedFiles[currentFileIndex]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("docType", editedType)
      formData.append("ownerType", editedOwnerType)
      formData.append("ownerName", editedOwnerName)
      formData.append("jurisdiction", editedJurisdiction)
      formData.append("licenseNumber", editedLicenseNumber)
      formData.append("expiresAt", editedExpiration)
      formData.append("classificationRaw", JSON.stringify(classification))

      if (duplicateCheck?.documentToMarkHistorical) {
        formData.append("documentToMarkHistorical", duplicateCheck.documentToMarkHistorical)
      }
      if (duplicateCheck?.isHistorical) {
        formData.append("saveAsHistorical", "true")
      }

      console.log("[v0] Sending document to save API:", {
        docType: editedType,
        ownerType: editedOwnerType,
        ownerName: editedOwnerName,
        expiresAt: editedExpiration,
      })

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Save API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Save API error response:", errorData)
        const errorMessage = errorData.details || errorData.error || "Failed to save document"
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("[v0] Document saved successfully:", data.document)
      setUploadStatus("success")
      onUploadComplete?.(data.document)

      setTimeout(() => {
        if (currentFileIndex < selectedFiles.length - 1) {
          setCurrentFileIndex((prev) => prev + 1)
          setUploadStatus("idle")
          setIsEditing(false)
          processFile(selectedFiles[currentFileIndex + 1])
        } else {
          setTimeout(() => {
            handleClose()
            window.dispatchEvent(new CustomEvent("documentsUpdated"))
          }, 1000)
        }
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Save error:", error)
      toast({
        title: "Save Failed",
        description: error.message || "Unable to save document. Please try again.",
        variant: "destructive",
      })
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to save document")
    }
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  const getFileType = () => {
    if (selectedFiles.length === 0) return null
    const file = selectedFiles[currentFileIndex]
    if (file.type === "application/pdf") return "pdf"
    if (file.type.startsWith("image/")) return "image"
    return "unknown"
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPdfLoading(false)
  }

  const onDocumentLoadError = (error: any) => {
    setPdfError("Failed to load PDF")
    setPdfLoading(false)
    console.error("[v0] PDF load error:", error)
  }

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-card shadow-xl ${
          uploadStatus === "results" ? "max-w-6xl" : "max-w-2xl"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Documents</h2>
            {selectedFiles.length > 1 && (
              <p className="text-sm text-muted-foreground">
                File {currentFileIndex + 1} of {selectedFiles.length}
              </p>
            )}
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {uploadStatus === "idle" && (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                  isDragging ? "border-[#3b82f6] bg-blue-50" : "border-border hover:border-[#3b82f6]/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFiles.length > 0 ? (
                  <div className="space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#3b82f6]" />
                          <div className="text-left">
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFiles([])
                      }}
                      className="text-sm text-[#3b82f6] hover:underline"
                    >
                      Clear all files
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-blue-50 p-4">
                        <Upload className="h-8 w-8 text-[#3b82f6]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-medium mb-2">Drag & drop your documents here</p>
                      <p className="text-sm text-muted-foreground">or click to browse files</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Supported: PDF, JPG, PNG - Max 10MB per file</div>
                  </div>
                )}
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleUpload}
                    className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#3b82f6]/90 transition-colors"
                  >
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? "Document" : "Documents"}
                  </button>
                </div>
              )}
            </>
          )}

          {uploadStatus === "processing" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-[#3b82f6] mb-6" />
              <p className="text-lg font-semibold text-foreground mb-2">AI Processing Document</p>
              <p className="text-sm text-muted-foreground">Extracting key information from your document...</p>
            </div>
          )}

          {uploadStatus === "results" && classification && (
            <div className="flex gap-6 max-h-[70vh]">
              <div className="w-1/2 flex flex-col border border-border rounded-lg overflow-hidden bg-muted/20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {selectedFiles[currentFileIndex]?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewRotation((prev) => (prev + 90) % 360)}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                      title="Rotate 90°"
                    >
                      <RotateCw className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                      onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.25))}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                      title="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <span className="text-xs text-muted-foreground w-12 text-center">
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button
                      onClick={() => setPreviewZoom(Math.min(3, previewZoom + 0.25))}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                      title="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 flex flex-col items-center bg-[#f5f5f5]">
                  {filePreviewUrl && getFileType() === "image" && (
                    <img
                      src={filePreviewUrl || "/placeholder.svg"}
                      alt="Document preview"
                      className="max-w-full shadow-lg rounded border border-border transition-transform"
                      style={{
                        transform: `scale(${previewZoom}) rotate(${previewRotation}deg)`,
                        transformOrigin: "center center",
                      }}
                    />
                  )}

                  {filePreviewUrl && getFileType() === "pdf" && (
                    <div
                      className="flex flex-col items-center w-full"
                      style={{
                        transform: `rotate(${previewRotation}deg)`,
                        transformOrigin: "center center",
                      }}
                    >
                      {pdfLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6] mb-2" />
                          <p className="text-sm text-muted-foreground">Loading PDF...</p>
                        </div>
                      )}

                      {pdfError && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                          <FileText className="h-16 w-16 mb-4" />
                          <p className="text-sm">{pdfError}</p>
                        </div>
                      )}

                      <Document
                        file={filePreviewUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading=""
                        className="flex flex-col items-center"
                      >
                        <Page
                          pageNumber={pageNumber}
                          scale={previewZoom}
                          className="shadow-lg rounded border border-border"
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>

                      {numPages && numPages > 1 && !pdfLoading && !pdfError && (
                        <div className="flex items-center gap-3 mt-4 bg-white rounded-lg shadow px-3 py-2">
                          <button
                            onClick={goToPreviousPage}
                            disabled={pageNumber <= 1}
                            className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm text-muted-foreground">
                            Page {pageNumber} of {numPages}
                          </span>
                          <button
                            onClick={goToNextPage}
                            disabled={pageNumber >= numPages}
                            className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {getFileType() === "unknown" && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <FileText className="h-16 w-16 mb-4" />
                      <p className="text-sm">Preview not available for this file type</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-1/2 overflow-y-auto space-y-4">
                {duplicateCheck?.isDuplicate && (
                  <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Possible Duplicate Detected
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          A document with the same license number ({editedLicenseNumber}) for {editedOwnerName} already
                          exists in the system.
                        </p>
                        {duplicateCheck.existingDocument && (
                          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                            Existing: {duplicateCheck.existingDocument.document_type} •{" "}
                            {duplicateCheck.existingDocument.expiration_date
                              ? `Expires ${new Date(duplicateCheck.existingDocument.expiration_date).toLocaleDateString()}`
                              : "No expiration"}{" "}
                            •{" "}
                            {duplicateCheck.existingDocument.created_at
                              ? `Uploaded ${new Date(duplicateCheck.existingDocument.created_at).toLocaleDateString()}`
                              : ""}
                          </div>
                        )}
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                          You can still proceed to save this as a new document, or cancel and delete the old one first.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {duplicateCheck?.isRenewal && (
                  <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Renewal Detected</h3>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          This document is a renewal of the existing document ({duplicateCheck.documentToMarkHistorical}
                          ).
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                          The existing document will be marked as historical.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {duplicateCheck?.isHistorical && (
                  <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Historical Document</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          This document will be saved as historical.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Extracted Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-sm text-[#3b82f6] hover:underline"
                  >
                    <Edit2 className="h-4 w-4" />
                    {isEditing ? "Done Editing" : "Edit Information"}
                  </button>
                </div>

                <p className="text-sm text-muted-foreground -mt-2">
                  Review the extracted data against the original document on the left.
                </p>

                <div className="space-y-3">
                  <div className="bg-blue-50 border border-[#3b82f6]/20 rounded-lg p-3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Document Type</label>
                    {isEditing ? (
                      <select
                        value={editedType}
                        onChange={(e) => setEditedType(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      >
                        <option value="Medical License">Medical License</option>
                        <option value="Occupational Therapy Assistant License">
                          Occupational Therapy Assistant License
                        </option>
                        <option value="Nursing License">Nursing License</option>
                        <option value="DEA Certificate">DEA Certificate</option>
                        <option value="Facility Permit">Facility Permit</option>
                        <option value="Insurance Card">Insurance Card</option>
                        <option value="Certification">Certification</option>
                        <option value="Background Check">Background Check</option>
                        <option value="Payer Contract">Payer Contract</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-base font-semibold text-foreground">{editedType}</p>
                    )}
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Owner Type</label>
                    {isEditing ? (
                      <select
                        value={editedOwnerType}
                        onChange={(e) => setEditedOwnerType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      >
                        <option value="staff">Staff Member</option>
                        <option value="facility">Facility</option>
                        <option value="payer">Payer</option>
                        <option value="organization">Organization</option>
                      </select>
                    ) : (
                      <p className="text-base font-semibold text-foreground capitalize">{editedOwnerType}</p>
                    )}
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Owner Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedOwnerName}
                        onChange={(e) => setEditedOwnerName(e.target.value)}
                        placeholder="Staff name, facility name, or payer name"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      />
                    ) : (
                      <p className="text-base font-semibold text-foreground">{editedOwnerName || "Not specified"}</p>
                    )}
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      License/Certificate Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLicenseNumber}
                        onChange={(e) => setEditedLicenseNumber(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      />
                    ) : (
                      <p className="text-base font-mono font-semibold text-foreground">
                        {editedLicenseNumber || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Expiration Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedExpiration}
                        onChange={(e) => setEditedExpiration(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      />
                    ) : (
                      <p className="text-base font-semibold text-foreground">
                        {editedExpiration ? new Date(editedExpiration).toLocaleDateString() : "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Jurisdiction</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedJurisdiction}
                        onChange={(e) => setEditedJurisdiction(e.target.value)}
                        placeholder="e.g., Illinois, Texas"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      />
                    ) : (
                      <p className="text-base font-semibold text-foreground">{editedJurisdiction || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#3b82f6]/90 transition-colors"
                  >
                    Confirm & Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === "saving" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-[#3b82f6] mb-6" />
              <p className="text-lg font-semibold text-foreground mb-2">Saving to Documents & Reports...</p>
              <p className="text-sm text-muted-foreground">This will only take a moment</p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-green-100 p-4 mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Document Saved Successfully!</p>
              <p className="text-sm text-muted-foreground">
                {currentFileIndex < selectedFiles.length - 1
                  ? "Processing next document..."
                  : "You can view and edit this document in Documents & Reports."}
              </p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-red-100 p-4 mb-6">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Upload Failed</p>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">{errorMessage}</p>
              <button
                onClick={() => setUploadStatus("idle")}
                className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#3b82f6]/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
