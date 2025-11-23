"use client"

import { useState } from "react"
import { Mail, MessageSquare, CheckCircle } from "lucide-react"

interface GenerateStaffLinkModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GenerateStaffLinkModal({ isOpen, onClose }: GenerateStaffLinkModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms" | "both">("email")

  if (!isOpen) return null

  const extractedData = {
    name: "Staff Member",
    email: "staff@example.com",
    phone: "(555) 123-4567",
  }

  const handleSend = () => {
    alert(`Signature link sent via ${selectedMethod}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-gray-900">Send to Staff for Signature</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-green-900">Supervisor Attestation Complete</p>
              <p className="text-[13px] text-green-700 mt-1">
                You've signed as supervisor. Now send to {extractedData.name} for their final signature.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Choose notification method:</h3>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod("email")}
                className={`w-full text-left border-2 rounded-lg p-4 transition-colors ${
                  selectedMethod === "email"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-gray-900">Email</p>
                    <p className="text-[13px] text-gray-600">{extractedData.email}</p>
                  </div>
                  {selectedMethod === "email" && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod("sms")}
                className={`w-full text-left border-2 rounded-lg p-4 transition-colors ${
                  selectedMethod === "sms"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-gray-900">SMS Text</p>
                    <p className="text-[13px] text-gray-600">{extractedData.phone}</p>
                  </div>
                  {selectedMethod === "sms" && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod("both")}
                className={`w-full text-left border-2 rounded-lg p-4 transition-colors ${
                  selectedMethod === "both"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-gray-900">Both Email & SMS</p>
                    <p className="text-[13px] text-gray-600">Recommended for fastest response</p>
                  </div>
                  {selectedMethod === "both" && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-[13px] text-yellow-900 font-medium">Signature Link Expires in 7 Days</p>
            <p className="text-[13px] text-yellow-800 mt-1">
              The signature link will remain active for 7 days. You can resend if needed.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-[14px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-[14px] font-medium hover:bg-blue-700"
            >
              Send Signature Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
