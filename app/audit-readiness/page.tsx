"use client"

import { useState } from "react"
import Link from "next/link"
import { UpgradeOverlay } from "@/components/upgrade-overlay"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { SandboxPageOverlay } from "@/components/sandbox-page-overlay"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { useOrg } from "@/lib/contexts/org-context"

type AuditType = "general" | "state" | "fire" | "payer" | "custom"

function AuditReadinessContent() {
  const { org } = useOrg()

  const sandboxData = getSandboxDataForOrg(org?.type || "surgery_center")

  const [selectedAuditType, setSelectedAuditType] = useState<AuditType>("general")
  const [showComplete, setShowComplete] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showUploadOverlay, setShowUploadOverlay] = useState(false)
  const [showAuditOverlay, setShowAuditOverlay] = useState(false)

  const completeItemsFromSandbox = sandboxData.SANDBOX_AUDIT_COMPLETE_ITEMS.map((item, index) => ({
    id: `c${index + 1}`,
    category: "Compliance",
    item: item,
    status: "complete" as const,
    auditTypes: ["general" as const],
  }))

  const allItems = [...sandboxData.SANDBOX_AUDIT_MISSING, ...completeItemsFromSandbox]

  // Filter items by selected audit type
  const filteredItems = allItems.filter((item) => item.auditTypes.includes(selectedAuditType))
  const missingItems = filteredItems.filter((item) => item.status === "incomplete")
  const completeItems = filteredItems.filter((item) => item.status === "complete")

  const totalItems = filteredItems.length
  const metItems = completeItems.length
  const readinessPercent = Math.round((metItems / totalItems) * 100)

  const auditTypeLabels = {
    general: "General Audit",
    state: "State Regulatory",
    fire: "Facility Audit",
    payer: "Payer-Specific",
    custom: "Custom Upload",
  }

  return (
    <div className="min-h-screen bg-background">
      <SandboxPageOverlay
        pageKey="audit-readiness"
        title="Preview an audit checklist in sandbox mode"
        description="This page is showing an example audit checklist and findings so you can see the type of gaps CareLumi highlights before an audit. In your trial, we use your uploads to understand your documents, but full audit checklists and packages are only available on paid plans."
        featureName="Audit"
      />

      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-foreground">Audit Readiness</h1>
              <Link href="/dashboard" className="text-sm text-primary hover:underline">
                ← Back to Dashboard
              </Link>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadOverlay(true)}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Upload Auditor Requirements
              </button>
              <button
                onClick={() => setShowAuditOverlay(true)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Generate Audit Package
              </button>
            </div>
          </div>

          {/* Overall Status Banner */}
          <div className="mb-6 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                {selectedAuditType !== "custom" && (
                  <>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-3xl font-bold text-foreground">{readinessPercent}%</span>
                      <span className="text-sm text-muted-foreground">Ready</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {metItems} of {totalItems} items complete
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-amber-600">{missingItems.length} items need attention</span>
                    </div>
                  </>
                )}
                {selectedAuditType === "custom" && (
                  <p className="text-sm text-muted-foreground">
                    Upload auditor requirements to generate a custom checklist
                  </p>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Audit Type:</label>
                <select
                  value={selectedAuditType}
                  onChange={(e) => setSelectedAuditType(e.target.value as AuditType)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(auditTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Missing Items Section */}
          {missingItems.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Missing Items ({missingItems.length})</h2>
              <div className="space-y-3">
                {missingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className="mt-1 h-5 w-5 flex-shrink-0 text-red-600"
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
                      <div>
                        <p className="font-medium text-foreground">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        {item.action && <p className="mt-1 text-sm text-red-700">{item.action}</p>}
                      </div>
                    </div>
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Items Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowComplete(!showComplete)}
              className="mb-4 flex w-full items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-foreground">Complete Items ({completeItems.length})</h2>
              <svg
                className={`h-5 w-5 text-muted-foreground transition-transform ${showComplete ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showComplete && (
              <div className="space-y-2">
                {completeItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.item}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showUploadOverlay && (
        <UpgradeOverlay
          feature="upload-auditor-requirements"
          title="Contact Sales to Upgrade"
          description="Upload custom auditor requirements and generate tailored compliance checklists. Contact our sales team to unlock this premium feature."
        />
      )}
      {showAuditOverlay && (
        <UpgradeOverlay
          feature="generate-audit-package"
          title="Contact Sales to Upgrade"
          description="Generate comprehensive audit packages with all required documentation. Contact our sales team to unlock this premium feature."
        />
      )}
    </div>
  )
}

export default function AuditReadinessPage() {
  return <AuditReadinessContent />
}
