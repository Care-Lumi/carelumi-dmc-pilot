"use client"

interface RenewalFormModalProps {
  isOpen?: boolean
  onClose?: () => void
  onContinue?: () => void
  onBack?: () => void
  extractedData?: {
    name: string
    licenseNumber: string
    licenseType: string
    address: string
    email: string
    phone: string
  }
  renewalMethod?: string
}

export function RenewalFormModal({
  isOpen = false,
  onClose,
  onContinue,
  onBack,
  extractedData,
  renewalMethod,
}: RenewalFormModalProps) {
  if (!isOpen || !extractedData) return null

  const isSupervisorPath = renewalMethod === "supervisor-complete"

  const handleContinue = () => {
    onContinue?.()
  }

  const handleBack = () => {
    onBack?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-gray-900">Renewal Application Form</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[13px] text-blue-900">
              All information has been pre-filled from your existing license. Please review for accuracy.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={extractedData.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={extractedData.licenseNumber}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-gray-700 mb-1">License Type</label>
                <input
                  type="text"
                  value={extractedData.licenseType}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={extractedData.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={extractedData.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={extractedData.phone}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px]"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold mb-3">Continuing Education Attestation</h3>
              <div className="space-y-2">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span className="text-[13px] text-gray-700">
                    I attest that the applicant completed the required hours of continuing education as required.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span className="text-[13px] text-gray-700">
                    I attest that applicant is in good standing with no disciplinary actions
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-[14px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-[14px] font-medium hover:bg-blue-700"
            >
              {isSupervisorPath ? "Continue to Supervisor Signature" : "Continue to Signature"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
