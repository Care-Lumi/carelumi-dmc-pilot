"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle2, XCircle, Camera } from "lucide-react"

interface DocumentUploadProps {
  onUploadSuccess?: (classification: any) => void
  onClose?: () => void
}

export function DocumentUpload({ onUploadSuccess, onClose }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setUploadStatus('processing')
    setErrorMessage('')

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      // Call classification API
      const response = await fetch('/api/classify-document', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to classify document')
      }

      // Success!
      setResult(data)
      setUploadStatus('success')
      
      // Callback to parent component
      onUploadSuccess?.(data)

      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onClose?.()
      }, 3000)

    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setErrorMessage(error.message || 'Failed to process document')
    } finally {
      setIsProcessing(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const StatusDisplay = () => {
    if (uploadStatus === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-foreground">Processing document...</p>
          <p className="text-sm text-muted-foreground mt-2">
            AI is analyzing your compliance document
          </p>
        </div>
      )
    }

    if (uploadStatus === 'success' && result) {
      const { classification, metadata } = result
      
      return (
        <div className="py-8">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-success p-3">
              <CheckCircle2 className="h-8 w-8 text-success-foreground" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-center text-foreground mb-2">
            Document Classified Successfully!
          </h3>
          
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Document Type</p>
              <p className="text-lg font-semibold text-foreground">{classification.documentType}</p>
            </div>

            {classification.identifiers?.providerName && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Provider</p>
                <p className="text-lg font-semibold text-foreground">{classification.identifiers.providerName}</p>
              </div>
            )}

            {classification.identifiers?.licenseNumber && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">License Number</p>
                <p className="text-lg font-mono text-foreground">{classification.identifiers.licenseNumber}</p>
              </div>
            )}

            {classification.validity?.expirationDate && (
              <div className={`rounded-lg border p-4 ${
                classification.validity.isExpired 
                  ? 'border-destructive bg-destructive/10'
                  : classification.validity.daysUntilExpiration < 60
                  ? 'border-warning bg-warning/10'
                  : 'border-border bg-muted/30'
              }`}>
                <p className="text-sm font-medium text-muted-foreground mb-1">Expiration</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(classification.validity.expirationDate).toLocaleDateString()}
                </p>
                {classification.validity.daysUntilExpiration !== null && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {classification.validity.isExpired 
                      ? '⚠️ EXPIRED'
                      : `${classification.validity.daysUntilExpiration} days remaining`
                    }
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Closing automatically...
          </p>
        </div>
      )
    }

    if (uploadStatus === 'error') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Upload Failed</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {errorMessage}
          </p>
          <button
            onClick={() => setUploadStatus('idle')}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )
    }

    // Idle state - show upload zone
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-12 transition-colors ${
          isDragging
            ? 'border-primary bg-accent'
            : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-accent/50'
        }`}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Upload Compliance Document
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            Drag & drop your license, certificate, or permit here, or click to browse
          </p>

          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                triggerFileInput()
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <FileText className="h-4 w-4" />
              Choose File
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation()
                triggerFileInput()
              }}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </button>
          </div>

          <div className="text-xs text-muted-foreground">
            Supported formats: PDF, JPG, PNG • Max size: 10MB
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <StatusDisplay />
    </div>
  )
}
