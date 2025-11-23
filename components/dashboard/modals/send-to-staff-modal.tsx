"use client"

import { useState } from "react"
import { X, Mail, MessageSquare, CheckCircle2, User, Calendar, FileText } from "lucide-react"

interface SendToStaffModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendToStaffModal({ isOpen, onClose }: SendToStaffModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  // Pre-filled contact info for demo
  const staffEmail = "soboateng@andatherapy.com"
  const staffPhone = "(312) 555-0147"

  if (!isOpen) return null

  const handleSend = () => {
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Send Renewal Request to Staff</h2>
            <p className="text-sm text-gray-600 mt-1">
              Staff member will receive a secure link to complete their renewal
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Request Sent Successfully!</p>
                <p className="text-sm text-green-800 mt-1">
                  Email and SMS sent to Samuel. They have 7 days to complete the renewal.
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">Samuel Osei Boateng</div>
                <div className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Illinois OTA License #057.005783
                </div>
                <div className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expires: 12/31/2025 (40 days remaining)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Contact Information</h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-xs text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{staffEmail}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-xs text-gray-600">Phone (SMS)</div>
                <div className="font-medium text-gray-900">{staffPhone}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">What Staff Member Will Receive</h3>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-5 space-y-4 text-sm">
              <div className="space-y-2">
                <p className="text-gray-700">Hi Samuel,</p>

                <p className="text-gray-700">
                  Your <strong>Illinois OTA License (#057.005783)</strong> expires on{" "}
                  <strong className="text-red-600">12/31/2025</strong>.
                </p>

                <p className="text-gray-700">We've prepared your renewal application to make this easy:</p>
              </div>

              <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 text-center">
                <div className="text-primary font-semibold mb-1">Complete Your Renewal</div>
                <div className="text-xs text-gray-600">Secure link • Expires in 7 days</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="font-semibold text-gray-900">Quick Steps:</div>
                <ol className="space-y-1 text-xs text-gray-700">
                  <li>1. Review pre-filled license information</li>
                  <li>2. Confirm continuing education completion</li>
                  <li>3. Provide digital signature</li>
                  <li>4. Submit to IDFPR</li>
                </ol>
              </div>

              <p className="text-xs text-gray-600 italic">Questions? Reply to this message or contact your admin.</p>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900">Time Sensitive</p>
                <p className="text-amber-800 mt-1">
                  Secure link expires in <strong>7 days</strong>. License must be renewed by <strong>12/31/2025</strong>{" "}
                  or reinstatement will be required.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">Staff will be notified via email and SMS</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={showSuccess}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={showSuccess}
              className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {showSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
