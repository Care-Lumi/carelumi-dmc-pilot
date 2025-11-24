"use client"

import { useState } from "react"

interface GenerateAuditModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GenerateAuditModal({ isOpen, onClose }: GenerateAuditModalProps) {
  const [step, setStep] = useState(1)
  const [selectedAuditType, setSelectedAuditType] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("zip")
  const [showUpsellModal, setShowUpsellModal] = useState(false)

  if (!isOpen) return null

  const auditTypes = [
    { id: "general", name: "General Compliance", description: "Complete organizational audit package" },
    { id: "state", name: "State Regulatory", description: "State-specific regulatory requirements" },
    { id: "fire", name: "Fire Safety", description: "Fire marshal inspection documentation" },
    { id: "payer", name: "Payer-Specific", description: "Insurance payer credentialing package" },
    { id: "custom", name: "Custom Upload", description: "Based on uploaded auditor requirements" },
  ]

  const handleUpgrade = () => {
    setShowUpsellModal(true)
  }

  const handleCloseUpsell = () => {
    setShowUpsellModal(false)
    onClose()
    setStep(1)
    setSelectedAuditType("")
  }

  const handleGeneratePackage = () => {
    // Simulate package generation
    console.log(`Generating ${selectedFormat} package for ${selectedAuditType}`)
    onClose()
    setStep(1)
    setSelectedAuditType("")
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Main Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl max-h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-white shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Preview Audit Package (Sandbox) {step === 2 && "- Review"}
            </h2>
            {step === 1 && (
              <p className="text-sm text-muted-foreground mt-1">
                This is an example audit package using Texas ASC sandbox data. Generating real audit packages is
                available on paid plans.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              onClose()
              setStep(1)
              setSelectedAuditType("")
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div>
              <p className="mb-6 text-sm text-muted-foreground">
                Select the type of audit package you want to preview:
              </p>
              <div className="space-y-3">
                {auditTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedAuditType(type.id)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                      selectedAuditType === type.id
                        ? "border-primary bg-gray-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAuditType === type.id ? "border-primary" : "border-gray-300"
                        }`}
                      >
                        {selectedAuditType === type.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 border border-amber-200">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Sample data · Not based on your uploaded documents
              </div>

              <p className="mb-6 text-sm text-muted-foreground">
                This example shows what a CareLumi audit package could include for a multi-site ASC in Texas.
              </p>

              <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <h3 className="mb-2 font-semibold text-foreground">Package Contents</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-foreground">91 documents</span>
                  <span className="flex items-center gap-1.5 text-green-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    88 included
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    3 missing
                  </span>
                </div>
              </div>

              <h3 className="mb-3 font-semibold text-foreground">Document Categories</h3>
              <div className="space-y-3 mb-6">
                {[
                  { name: "Staff Credentials", docs: 45, missing: 2 },
                  { name: "Facility Documents", docs: 12, missing: 1 },
                  { name: "Policies & Procedures", docs: 18, missing: 0 },
                  { name: "Insurance & Contracts", docs: 13, missing: 0 },
                ].map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {category.missing > 0 ? (
                        <svg
                          className="h-5 w-5 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span className="font-medium text-foreground">{category.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-foreground">{category.docs} docs</span>
                      {category.missing > 0 && (
                        <span className="ml-2 text-amber-700">({category.missing} missing)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="mb-3 font-semibold text-foreground">Download Format</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedFormat("pdf")}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                    selectedFormat === "pdf"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === "pdf" ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      {selectedFormat === "pdf" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">PDF (Combined)</h4>
                      <p className="text-sm text-muted-foreground">Single PDF file with all documents</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedFormat("zip")}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                    selectedFormat === "zip"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === "zip" ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      {selectedFormat === "zip" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">ZIP (Organized)</h4>
                      <p className="text-sm text-muted-foreground">
                        Organized folders: /Staff/, /Facilities/, /Policies/
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-border bg-gray-50 p-6">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose()
                setStep(1)
                setSelectedAuditType("")
              }}
              className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!selectedAuditType}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Upgrade to Generate Real Audits
              </button>
            )}
          </div>
        </div>
      </div>

      {showUpsellModal && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50" onClick={handleCloseUpsell} />
          <div className="fixed left-1/2 top-1/2 z-[60] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-white shadow-lg p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Real Audit Generation Available on Paid Plans
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              In the full version of CareLumi, this button will generate a complete audit binder from your documents in
              one click. In this pilot, you can explore the sample checklist on the Audit Readiness page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseUpsell}
                className="flex-1 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 transition-colors"
              >
                Got it
              </button>
              <button
                onClick={() => window.open("mailto:hello@carelumi.com?subject=Audit Generation Inquiry", "_blank")}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
