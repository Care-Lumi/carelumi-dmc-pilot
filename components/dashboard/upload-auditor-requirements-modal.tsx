"use client"

import type React from "react"
import { useState } from "react"

interface UploadAuditorRequirementsModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (auditType: string, results: { met: number; missing: number }) => void
}

export function UploadAuditorRequirementsModal({ isOpen, onClose, onComplete }: UploadAuditorRequirementsModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [results, setResults] = useState({
    auditType: "",
    met: 0,
    missing: 0,
    totalRequired: 0,
  })

  if (!isOpen) return null

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const processingSteps = [
    "Extracting text from document...",
    "Identifying requirements...",
    "Mapping to existing data...",
    "Creating custom checklist...",
    "Calculating readiness...",
  ]

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)

    // Simulate AI processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i)
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    // Simulate results
    const mockResults = {
      auditType: "CARF",
      met: 18,
      missing: 7,
      totalRequired: 25,
    }

    setResults(mockResults)
    setIsProcessing(false)
    setShowResults(true)
  }

  const handleCompleteResults = () => {
    onComplete(results.auditType, { met: results.met, missing: results.missing })
    setShowResults(false)
    setFile(null)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-lg">
        {!showResults ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-semibold text-foreground">Upload Auditor Requirements</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Upload your auditor&apos;s requirements letter or email. Our AI will extract the requirements and create
                a custom checklist.
              </p>

              {/* File Upload Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging ? "border-primary bg-blue-50" : "border-border bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  disabled={isProcessing}
                />
                <div className="pointer-events-none">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {file ? (
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                  ) : (
                    <>
                      <p className="mb-1 text-sm font-medium text-foreground">Drop your PDF here or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supports PDF files</p>
                    </>
                  )}
                </div>
              </div>

              {/* Processing Steps */}
              {isProcessing && (
                <div className="mt-6 space-y-3">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {index < processingStep ? (
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : index === processingStep ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span
                        className={`text-sm ${
                          index <= processingStep ? "font-medium text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border p-6">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isProcessing}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Upload & Process"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-semibold text-foreground">Audit Requirements Processed</h2>
              <button onClick={handleCompleteResults} className="text-muted-foreground hover:text-foreground">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Results Content */}
            <div className="p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Your audit requirements have been processed. Here are the results:
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Audit Type:</span>
                  <span className="text-sm text-foreground">{results.auditType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Requirements Met:</span>
                  <span className="text-sm text-foreground">{results.met}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Requirements Missing:</span>
                  <span className="text-sm text-foreground">{results.missing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total Required:</span>
                  <span className="text-sm text-foreground">{results.totalRequired}</span>
                </div>
              </div>
            </div>

            {/* Results Footer */}
            <div className="flex justify-end gap-3 border-t border-border p-6">
              <button
                onClick={handleCompleteResults}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Complete
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
