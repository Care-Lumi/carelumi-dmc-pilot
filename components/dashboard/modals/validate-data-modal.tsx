"use client"

import { useState } from "react"
import Image from "next/image"

interface ValidateDataModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ValidateDataModal({ isOpen, onClose }: ValidateDataModalProps) {
  const [showOriginalDoc, setShowOriginalDoc] = useState(false)

  if (!isOpen) return null

  const extractedData = {
    name: "Samuel Osei Boateng",
    licenseNumber: "057.005783",
    licenseType: "Illinois OTA",
    expiresAt: "12/31/2025",
  }

  const handleSupervisorAttestation = () => {
    alert("Supervisor attestation flow started")
    onClose()
  }

  const handleSendToStaff = () => {
    alert("Sending to staff member")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-gray-900">Validate Extracted Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-amber-900">License Expiring in 40 Days</p>
              <p className="text-[13px] text-amber-800 mt-1">
                Expires: {extractedData.expiresAt}. Choose how you'd like to complete the renewal process below.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-gray-900">How would you like to complete this renewal?</h3>

            <button
              onClick={handleSupervisorAttestation}
              className="w-full text-left border-2 border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">👔</div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-blue-900">I'm the Supervisor - I Can Attest</p>
                  <p className="text-[13px] text-blue-800 mt-1">
                    <strong>Recommended:</strong> Complete attestation and sign as supervisor, then send to Samuel for
                    final signature. Fastest option.
                  </p>
                  <p className="text-[12px] text-blue-700 mt-2 font-medium">Estimated time: 5-10 minutes</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleSendToStaff}
              className="w-full text-left border-2 border-gray-200 bg-gray-50 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">📧</div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-gray-900">Send to Staff Member</p>
                  <p className="text-[13px] text-gray-700 mt-1">
                    Send the entire renewal process to Samuel to complete independently. Requires staff action.
                  </p>
                  <p className="text-[12px] text-gray-600 mt-2 font-medium">Estimated time: 1-2 business days</p>
                </div>
              </div>
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <h4 className="text-[14px] font-semibold text-gray-900">Extracted License Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium text-gray-600">License Holder</label>
                <p className="text-[14px] text-gray-900">{extractedData.name}</p>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-600">License Number</label>
                <p className="text-[14px] text-gray-900">{extractedData.licenseNumber}</p>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-600">License Type</label>
                <p className="text-[14px] text-gray-900">{extractedData.licenseType}</p>
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-600">Expires</label>
                <p className="text-[14px] text-red-600 font-medium">{extractedData.expiresAt}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowOriginalDoc(!showOriginalDoc)}
            className="text-[14px] text-blue-600 hover:underline font-medium"
          >
            {showOriginalDoc ? "Hide" : "View"} Original Document
          </button>

          {showOriginalDoc && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src="/images/screenshot-202025-11-21-20at-201.png"
                alt="Samuel Osei Boateng License"
                width={800}
                height={1000}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
