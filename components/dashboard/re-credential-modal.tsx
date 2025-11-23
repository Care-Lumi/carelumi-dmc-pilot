"use client"

import { useState } from "react"
import { X, AlertCircle } from "lucide-react"

interface ReCredentialModalProps {
  isOpen: boolean
  onClose: () => void
  payerName: string
  providerName: string
}

export function ReCredentialModal({ isOpen, onClose, payerName, providerName }: ReCredentialModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-2xl font-semibold text-foreground">Re-Credential Provider</h2>

        {showSuccess ? (
          <div className="my-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">Re-credentialing process initiated!</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">Re-credentialing Notice</p>
                <p className="mt-1 text-sm text-amber-700">
                  Most payers require re-credentialing every 2-3 years. CareLumi will guide you through the process and
                  track all required documents.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-3 text-sm font-medium text-foreground">Re-Credentialing Details</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Payer:</span> {payerName}
                  </p>
                  <p>
                    <span className="font-medium">Provider:</span> {providerName}
                  </p>
                  <p>
                    <span className="font-medium">Expected Timeline:</span> 45-90 days
                  </p>
                  <p>
                    <span className="font-medium">Process:</span> CareLumi will auto-generate updated application with
                    current credentials
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">What happens next?</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• System verifies current credentials are up to date</li>
                  <li>• Auto-generates re-credentialing application</li>
                  <li>• Submits to payer portal</li>
                  <li>• Tracks status and sends updates</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Start Re-Credentialing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
