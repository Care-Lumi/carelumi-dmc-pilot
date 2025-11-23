"use client"

import { useState } from "react"

interface SupervisorSignatureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupervisorSignatureModal({ isOpen, onClose }: SupervisorSignatureModalProps) {
  const [localSignature, setLocalSignature] = useState("")

  const handleSubmit = () => {
    alert("Supervisor signature recorded!")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-gray-900">Supervisor Digital Signature</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[14px] text-blue-900 font-medium">Supervisor Attestation</p>
            <p className="text-[13px] text-blue-800 mt-1">
              By signing, you attest that the staff member has completed all required continuing education hours and is
              in good standing to renew their license.
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              Type your full name as supervisor
            </label>
            <input
              type="text"
              value={localSignature}
              onChange={(e) => setLocalSignature(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {localSignature && (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center">
              <p className="text-[32px] font-serif text-gray-900" style={{ fontFamily: "Brush Script MT, cursive" }}>
                {localSignature}
              </p>
              <p className="text-[12px] text-gray-500 mt-3">Supervisor Signature</p>
              <p className="text-[12px] text-gray-500">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-[14px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!localSignature}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-[14px] font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to Staff Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
