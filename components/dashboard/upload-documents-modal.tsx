"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle2, XCircle, Edit2, AlertTriangle } from "lucide-react"

interface UploadDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess?: (classification: any) => void
}

export function UploadDocumentsModal({ isOpen, onClose, onUploadSuccess }: UploadDocumentsModalProps) {
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

  // Editable fields
  const [editedType, setEditedType] = useState("")
  const [editedOwnerName, setEditedOwnerName] = useState("")
  const [editedOwnerType, setEditedOwnerType] = useState<"staff" | "facility" | "payer" | "organization">("staff")
  const [editedLicenseNumber, setEditedLicenseNumber] = useState("")
  const [editedExpiration, setEditedExpiration] = useState("")
  const [editedJurisdiction, setEditedJurisdiction] = useState("")

  const [duplicateCheck, setDuplicateCheck] = useState<{
    isDuplicate: boolean
    existingDocument?: any
  } | null>(null)

  if (!isOpen) return null

  const resetModal = () => {
    setSelectedFiles([])
    setCurrentFileIndex(0)
    setUploadStatus("idle")
    setClassification(null)
    setErrorMessage("")
    setIsEditing(false)
    setDuplicateCheck(null) // Reset duplicate check
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

      const response = await fetch("/api/classify-document", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
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

      if (editedLicenseNumber && extractedName) {
        await checkForDuplicates(
          editedLicenseNumber,
          extractedName,
          classification.documentType || result.docType || "",
        )
      }

      setUploadStatus("results")
    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to process document")
    }
  }

  const checkForDuplicates = async (licenseNumber: string, ownerName: string, docType: string) => {
    try {
      const response = await fetch("/api/documents/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseNumber, ownerName, docType }),
      })

      if (response.ok) {
        const data = await response.json()
        setDuplicateCheck(data)
        if (data.isDuplicate) {
          console.log("[v0] Duplicate document found:", data.existingDocument)
        }
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

  const handleSave = async () => {
    setUploadStatus("saving")

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

      console.log("[v0] Saving document with data:", {
        docType: editedType,
        ownerType: editedOwnerType,
        ownerName: editedOwnerName,
        expiresAt: editedExpiration,
      })

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save document")
      }

      const data = await response.json()
      console.log("[v0] Document saved successfully:", data.document)
      setUploadStatus("success")
      onUploadSuccess?.(data.document)

      // After 2 seconds, check if there are more files
      setTimeout(() => {
        if (currentFileIndex < selectedFiles.length - 1) {
          // Process next file
          setCurrentFileIndex((prev) => prev + 1)
          setUploadStatus("idle")
          setIsEditing(false)
          processFile(selectedFiles[currentFileIndex + 1])
        } else {
          setTimeout(() => {
            handleClose()
            // Signal parent to refresh data
            window.dispatchEvent(new CustomEvent("documentsUpdated"))
          }, 1000)
        }
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Save error:", error)
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to save document")
    }
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-card shadow-xl">
        {/* Header */}
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

        {/* Content */}
        <div className="p-6">
          {uploadStatus === "idle" && (
            <>
              {/* File Upload Area */}
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
                    <div className="text-xs text-muted-foreground">Supported: PDF, JPG, PNG • Max 10MB per file</div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
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
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
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

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Classification Results</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-sm text-[#3b82f6] hover:underline"
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? "Done Editing" : "Edit Information"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Document Type */}
                <div className="bg-blue-50 border border-[#3b82f6]/20 rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Document Type</label>
                  {isEditing ? (
                    <select
                      value={editedType}
                      onChange={(e) => setEditedType(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md"
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
                    <p className="text-lg font-semibold text-foreground">{editedType}</p>
                  )}
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Owner Type</label>
                  {isEditing ? (
                    <select
                      value={editedOwnerType}
                      onChange={(e) => setEditedOwnerType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      <option value="staff">Staff Member</option>
                      <option value="facility">Facility</option>
                      <option value="payer">Payer</option>
                      <option value="organization">Organization</option>
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-foreground capitalize">{editedOwnerType}</p>
                  )}
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Owner Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOwnerName}
                      onChange={(e) => setEditedOwnerName(e.target.value)}
                      placeholder="Staff name, facility name, or payer name"
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">{editedOwnerName || "Not specified"}</p>
                  )}
                </div>

                {/* License Number */}
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    License/Certificate Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedLicenseNumber}
                      onChange={(e) => setEditedLicenseNumber(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  ) : (
                    <p className="text-lg font-mono font-semibold text-foreground">
                      {editedLicenseNumber || "Not specified"}
                    </p>
                  )}
                </div>

                {/* Expiration Date */}
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Expiration Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedExpiration}
                      onChange={(e) => setEditedExpiration(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">
                      {editedExpiration ? new Date(editedExpiration).toLocaleDateString() : "Not specified"}
                    </p>
                  )}
                </div>

                {/* Jurisdiction */}
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Jurisdiction</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedJurisdiction}
                      onChange={(e) => setEditedJurisdiction(e.target.value)}
                      placeholder="e.g., Illinois, Texas"
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">{editedJurisdiction || "Not specified"}</p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#3b82f6]/90 transition-colors"
                >
                  Confirm & Save
                </button>
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
