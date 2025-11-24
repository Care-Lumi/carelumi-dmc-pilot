"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle2, XCircle, Edit2 } from "lucide-react"

interface UploadAuditorRequirementsModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: (auditType: string, results: { met: number; missing: number }) => void
}

export function UploadAuditorRequirementsModal({ isOpen, onClose, onComplete }: UploadAuditorRequirementsModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "results" | "success" | "error">("idle")
  const [classification, setClassification] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Editable fields
  const [editedType, setEditedType] = useState("")
  const [editedLicenseNumber, setEditedLicenseNumber] = useState("")
  const [editedExpiration, setEditedExpiration] = useState("")
  const [editedJurisdiction, setEditedJurisdiction] = useState("")

  if (!isOpen) return null

  const resetModal = () => {
    setSelectedFiles([])
    setCurrentFileIndex(0)
    setUploadStatus("idle")
    setClassification(null)
    setErrorMessage("")
    setIsEditing(false)
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

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/classify-document", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to classify document")
      }

      setClassification(data.classification)
      setEditedType(data.classification.documentType || "")
      setEditedLicenseNumber(data.classification.identifiers?.licenseNumber || "")
      setEditedExpiration(data.classification.validity?.expirationDate || "")
      setEditedJurisdiction(data.classification.jurisdiction?.state || "")
      setUploadStatus("results")
    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to process document")
    }
  }

  const handleSave = () => {
    const updatedClassification = {
      ...classification,
      documentType: editedType,
      identifiers: {
        ...classification.identifiers,
        licenseNumber: editedLicenseNumber,
      },
      validity: {
        ...classification.validity,
        expirationDate: editedExpiration,
      },
      jurisdiction: {
        ...classification.jurisdiction,
        state: editedJurisdiction,
      },
    }

    setUploadStatus("success")
    setClassification(updatedClassification)

    if (onComplete) {
      onComplete("CARF", { met: 18, missing: 7 })
    }

    setTimeout(() => {
      if (currentFileIndex < selectedFiles.length - 1) {
        setCurrentFileIndex((prev) => prev + 1)
        setUploadStatus("idle")
        setIsEditing(false)
        processFile(selectedFiles[currentFileIndex + 1])
      } else {
        setTimeout(() => {
          onClose()
          resetModal()
        }, 1500)
      }
    }, 2000)
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Auditor Requirements</h2>
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
                      <p className="text-base font-medium mb-2">Upload auditor requirements</p>
                      <p className="text-sm text-muted-foreground">AI will extract and classify requirements</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Supported: PDF, JPG, PNG • Max 10MB per file</div>
                  </div>
                )}
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleUpload}
                    className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#3b82f6]/90 transition-colors"
                  >
                    Upload & Process
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
            <div className="space-y-6">
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
                <div className="bg-blue-50 border border-[#3b82f6]/20 rounded-lg p-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Document Type</label>
                  {isEditing ? (
                    <select
                      value={editedType}
                      onChange={(e) => setEditedType(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      <option value="Medical License">Medical License</option>
                      <option value="DEA Certificate">DEA Certificate</option>
                      <option value="Facility Permit">Facility Permit</option>
                      <option value="Insurance Card">Insurance Card</option>
                      <option value="Certification">Certification</option>
                      <option value="Background Check">Background Check</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-foreground">{editedType}</p>
                  )}
                </div>

                {editedLicenseNumber && (
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      License/Certificate Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLicenseNumber}
                        onChange={(e) => setEditedLicenseNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md"
                      />
                    ) : (
                      <p className="text-lg font-mono font-semibold text-foreground">{editedLicenseNumber}</p>
                    )}
                  </div>
                )}

                {editedExpiration && (
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
                        {new Date(editedExpiration).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {editedJurisdiction && (
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Jurisdiction</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedJurisdiction}
                        onChange={(e) => setEditedJurisdiction(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-foreground">{editedJurisdiction}</p>
                    )}
                  </div>
                )}
              </div>

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

          {uploadStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-green-100 p-4 mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Document Saved Successfully!</p>
              <p className="text-sm text-muted-foreground">
                {currentFileIndex < selectedFiles.length - 1
                  ? "Processing next document..."
                  : "All documents processed"}
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
    </>
  )
}
