"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Clock } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const router = useRouter()

  const handleReturn = () => {
    onClose()
    router.refresh()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="p-8 space-y-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div>
            <h2 className="text-[24px] font-semibold mb-2">Submission Successful!</h2>
            <p className="text-[15px] text-gray-600">
              Your renewal application has been successfully submitted to the Illinois IDFPR regulatory portal.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-left space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] text-blue-900 font-semibold">Processing Timeline: 2-4 Business Days</p>
                <p className="text-[13px] text-blue-800 mt-1">
                  IDFPR typically processes renewals within 2-4 business days. CareLumi will automatically sync the
                  updated license status once it appears in IDFPR system records.
                </p>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-3">
              <p className="text-[13px] text-blue-900 font-medium mb-2">What happens next:</p>
              <ul className="text-[13px] text-blue-900 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Confirmation email sent within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>IDFPR reviews and processes application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Renewed license automatically syncs to CareLumi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Staff notification sent when complete</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
            <p className="text-[13px] font-medium text-gray-900 mb-1">Confirmation Details</p>
            <div className="text-[12px] text-gray-600 space-y-1">
              <p>License: #057.005783</p>
              <p>Submitted: {new Date().toLocaleString()}</p>
              <p>Confirmation: REN-2025-057005783</p>
              <p>Status: Processing by IDFPR</p>
            </div>
          </div>

          <button
            onClick={handleReturn}
            className="w-full px-8 py-3 bg-blue-600 text-white rounded-md text-[15px] font-medium hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
