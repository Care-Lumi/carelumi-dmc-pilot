"use client"

import { useState } from "react"
import Link from "next/link"
import { UploadAuditorRequirementsModal } from "@/components/dashboard/upload-auditor-requirements-modal"
import { GenerateAuditModal } from "@/components/dashboard/generate-audit-modal"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"

type AuditType = "general" | "state" | "fire" | "payer" | "custom"

interface ChecklistItem {
  id: string
  category: string
  item: string
  status: "complete" | "incomplete"
  action?: string
  auditTypes: AuditType[]
}

const allItems: ChecklistItem[] = [
  // Staff (7)
  {
    id: "s1",
    category: "Staff",
    item: "Current professional licenses verified",
    status: "complete",
    auditTypes: ["general", "state", "payer"],
  },
  {
    id: "s2",
    category: "Staff",
    item: "Required certifications on file",
    status: "incomplete",
    action: "Upload 2 missing CPR certifications",
    auditTypes: ["general", "state"],
  },
  {
    id: "s3",
    category: "Staff",
    item: "Background checks completed",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "s4",
    category: "Staff",
    item: "TB test results documented",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "s5",
    category: "Staff",
    item: "Mandatory training completed",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  { id: "s6", category: "Staff", item: "CEU requirements met", status: "complete", auditTypes: ["general", "payer"] },
  {
    id: "s7",
    category: "Staff",
    item: "Professional liability insurance active",
    status: "complete",
    auditTypes: ["general", "payer"],
  },

  // Facility (7)
  {
    id: "f1",
    category: "Facility",
    item: "Facility license current",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "f2",
    category: "Facility",
    item: "Fire safety inspection passed",
    status: "complete",
    auditTypes: ["general", "fire"],
  },
  {
    id: "f3",
    category: "Facility",
    item: "Health inspection current",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "f4",
    category: "Facility",
    item: "Certificate of occupancy valid",
    status: "complete",
    auditTypes: ["general", "state", "fire"],
  },
  {
    id: "f5",
    category: "Facility",
    item: "Liability insurance policy active",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "f6",
    category: "Facility",
    item: "Workers compensation coverage verified",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "f7",
    category: "Facility",
    item: "Emergency evacuation plan documented",
    status: "incomplete",
    action: "Update and upload current evacuation plan",
    auditTypes: ["general", "fire"],
  },

  // Documentation (7)
  {
    id: "d1",
    category: "Documentation",
    item: "Personnel files complete",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "d2",
    category: "Documentation",
    item: "Patient consent forms updated",
    status: "complete",
    auditTypes: ["general"],
  },
  {
    id: "d3",
    category: "Documentation",
    item: "HIPAA compliance documentation",
    status: "complete",
    auditTypes: ["general", "payer"],
  },
  {
    id: "d4",
    category: "Documentation",
    item: "Incident reports filed appropriately",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "d5",
    category: "Documentation",
    item: "Policy and procedure manuals current",
    status: "complete",
    auditTypes: ["general", "state"],
  },
  {
    id: "d6",
    category: "Documentation",
    item: "Quality improvement reports",
    status: "complete",
    auditTypes: ["general", "payer"],
  },
  {
    id: "d7",
    category: "Documentation",
    item: "Medical records audit completed",
    status: "complete",
    auditTypes: ["general", "payer"],
  },

  // Payer (4)
  {
    id: "p1",
    category: "Payer",
    item: "Active payer contracts on file",
    status: "complete",
    auditTypes: ["general", "payer"],
  },
  {
    id: "p2",
    category: "Payer",
    item: "Provider enrollment IDs verified",
    status: "complete",
    auditTypes: ["general", "payer"],
  },
  {
    id: "p3",
    category: "Payer",
    item: "Re-credentialing dates tracked",
    status: "incomplete",
    action: "Schedule re-credentialing for 3 providers",
    auditTypes: ["general", "payer"],
  },
  {
    id: "p4",
    category: "Payer",
    item: "CAQH profiles up to date",
    status: "complete",
    auditTypes: ["general", "payer"],
  },
]

function AuditReadinessContent() {
  const [selectedAuditType, setSelectedAuditType] = useState<AuditType>("general")
  const [showComplete, setShowComplete] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)

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

  const handleAuditUploadComplete = (auditType: string, results: { met: number; missing: number }) => {
    console.log("[v0] Custom audit uploaded:", auditType, results)
    // In a real implementation, this would add the new audit type to the system
  }

  return (
    <div className="min-h-screen bg-background">
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
                onClick={() => setShowUploadModal(true)}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Upload Auditor Requirements
              </button>
              <button
                onClick={() => setShowAuditModal(true)}
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

      <UploadAuditorRequirementsModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onComplete={handleAuditUploadComplete}
      />
      <GenerateAuditModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
    </div>
  )
}

export default function AuditReadinessPage() {
  return <AuditReadinessContent />
}
