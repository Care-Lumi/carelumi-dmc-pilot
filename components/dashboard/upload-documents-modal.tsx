"use client"

import type React from "react"

import { useState } from "react"

interface UploadDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadDocumentsModal({ isOpen, onClose }: UploadDocumentsModalProps) {
  const [documentType, setDocumentType] = useState("")
  const [assignTo, setAssignTo] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  if (!isOpen) return null

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
    const file = e.dataTransfer.files[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    console.log("[v0] Uploading:", { documentType, assignTo, file: selectedFile?.name })
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[700px] bg-white rounded-lg shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Upload Documents</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full h-10 px-3 border border-border rounded-md text-sm"
            >
              <option value="">Select document type...</option>
              <option value="license">Professional License</option>
              <option value="certification">Certification</option>
              <option value="background">Background Check</option>
              <option value="tb">TB Test</option>
              <option value="cpr">CPR Certification</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium mb-2">Assign To</label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full h-10 px-3 border border-border rounded-md text-sm"
            >
              <option value="">Select staff member...</option>
              <option value="martinez">Dr. Sarah Martinez</option>
              <option value="smith">Jane Smith, LCSW</option>
              <option value="davis">John Davis, PhD</option>
              <option value="lee">Sarah Lee, LCPC</option>
              <option value="chen">Michael Chen, PsyD</option>
            </select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">{selectedFile.name}</div>
                  <div className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                  <button onClick={() => setSelectedFile(null)} className="text-xs text-primary hover:underline">
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-muted-foreground mb-2">Drag & drop your file here, or click to browse</div>
                  <div className="text-xs text-muted-foreground mb-4">Supported: PDF, JPG, PNG, DOCX (max 10MB)</div>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-white border border-border rounded-md text-sm font-medium hover:border-primary cursor-pointer transition-colors inline-block">
                      Browse Files
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!documentType || !assignTo || !selectedFile}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </>
  )
}
