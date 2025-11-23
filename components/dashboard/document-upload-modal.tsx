"use client"

import { DocumentUpload } from "@/components/document-upload"

interface DocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess?: (classification: any) => void
}

export function DocumentUploadModal({ isOpen, onClose, onUploadSuccess }: DocumentUploadModalProps) {
  if (!isOpen) return null

  const handleSuccess = (classification: any) => {
    onUploadSuccess?.(classification)
    // Modal will auto-close after success (handled in DocumentUpload component)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Document</h2>
            <p className="text-sm text-muted-foreground">
              AI will automatically classify and extract key information
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close upload"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <DocumentUpload onUploadSuccess={handleSuccess} onClose={onClose} />
        </div>
      </div>
    </>
  )
}
