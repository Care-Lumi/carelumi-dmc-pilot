"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface AttestationModalProps {
  isOpen?: boolean
  onClose?: () => void
  onComplete?: () => void
}

export function AttestationModal({ isOpen = false, onClose, onComplete }: AttestationModalProps) {
  const [attesting, setAttesting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAttest = () => {
    setAttesting(true)
    setTimeout(() => {
      onComplete?.()
      setAttesting(false)
      setShowSuccess(true)
    }, 1500)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    onClose?.()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose?.()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">County Care CAQH Re-Attestation</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Confirm that all provider information in your CAQH profile remains current and accurate.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Attestation Requirements</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Provider demographics and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Current professional licenses and certifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Malpractice insurance coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Work history and education credentials</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>Important:</strong> By attesting, you confirm that all information in your CAQH profile is
                  current and accurate as of today. This attestation will be valid for 120 days.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onClose?.()} disabled={attesting}>
                Cancel
              </Button>
              <Button onClick={handleAttest} disabled={attesting} className="bg-primary text-white">
                {attesting ? "Attesting..." : "Attest Now"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Attestation Complete</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">Successfully Submitted</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your CAQH attestation has been completed and submitted to County Care.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  Your attestation is valid for 120 days. You will receive a reminder before it expires.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSuccessClose}>Close</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
