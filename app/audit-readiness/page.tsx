"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { useOrg } from "@/lib/contexts/org-context"
import { ChevronDown, ChevronUp, Upload, FileArchive, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { type AuditType, calculateAuditScore } from "@/lib/audit-requirements"

export default function AuditReadinessPage() {
  const { org } = useOrg()
  const sandboxData = getSandboxDataForOrg(org?.type || "surgery_center")

  const [selectedAuditType, setSelectedAuditType] = useState<AuditType>("general")
  const [showComplete, setShowComplete] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })

  // Prepare entities for audit calculation
  const entities = {
    staff: sandboxData.SANDBOX_DOCUMENTS.filter((doc: any) => doc.owner_type === "staff")
      .map((doc: any) => ({ id: doc.owner_id, name: doc.owner_name }))
      .filter((entity: any, index: number, self: any[]) => self.findIndex((e) => e.id === entity.id) === index),
    facilities: sandboxData.SANDBOX_FACILITIES || [],
    payers: sandboxData.SANDBOX_PAYERS || [],
  }

  // Calculate scores for all audit types
  const generalAudit = calculateAuditScore("general", sandboxData.SANDBOX_DOCUMENTS, entities)
  const stateAudit = calculateAuditScore("state", sandboxData.SANDBOX_DOCUMENTS, entities)
  const facilityAudit = calculateAuditScore("facility", sandboxData.SANDBOX_DOCUMENTS, entities)
  const payerAudit = calculateAuditScore("payer", sandboxData.SANDBOX_DOCUMENTS, entities)

  const auditScores = {
    general: generalAudit,
    state: stateAudit,
    facility: facilityAudit,
    payer: payerAudit,
  }

  const selectedAudit = auditScores[selectedAuditType]

  const atRiskGroups = selectedAudit.atRiskItems.reduce((acc: any, item: any) => {
    const key = `${item.doc_type}_${item.entity_type}`
    if (!acc[key]) {
      acc[key] = {
        doc_type: item.doc_type,
        entity_type: item.entity_type,
        count: 0,
        items: [],
      }
    }
    acc[key].count++
    acc[key].items.push(item)
    return acc
  }, {})

  const auditTypeCards = [
    { type: "general" as AuditType, label: "General Audit", score: generalAudit.score },
    { type: "state" as AuditType, label: "State Regulatory", score: stateAudit.score },
    { type: "facility" as AuditType, label: "Facility Audit", score: facilityAudit.score },
    { type: "payer" as AuditType, label: "Payer-Specific", score: payerAudit.score },
  ]

  const handleGenerateAuditPackage = () => {
    // TODO: Implement ZIP generation with summary PDF + organized docs
    alert("Generate Audit Package feature coming soon")
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-semibold text-foreground">Audit Readiness</h1>
              <p className="text-sm text-muted-foreground mt-1">Monitor compliance gaps across all audit types</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Auditor Requirements
              </Button>
              <Button onClick={handleGenerateAuditPackage}>
                <FileArchive className="mr-2 h-4 w-4" />
                Generate Audit Package
              </Button>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-4 gap-6">
            {auditTypeCards.map((audit) => (
              <Card
                key={audit.type}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedAuditType === audit.type && "ring-2 ring-primary shadow-lg",
                )}
                onClick={() => setSelectedAuditType(audit.type)}
              >
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{audit.label}</h3>
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-3xl font-bold",
                      audit.score >= 80 ? "text-green-600" : audit.score >= 60 ? "text-yellow-600" : "text-red-600",
                    )}
                  >
                    {audit.score}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Ready</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {Object.keys(atRiskGroups).length > 0 && (
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                At Risk Soon ({selectedAudit.atRiskItems.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(atRiskGroups).map((group: any, idx) => (
                  <Card key={idx} className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{group.doc_type}s expiring soon</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {group.count} {group.entity_type} {group.count === 1 ? "license" : "licenses"} expire within
                            60 days
                          </p>
                          <div className="mt-2 space-y-1">
                            {group.items.slice(0, 3).map((item: any, i: number) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                • {item.entity_name} - {item.days_until_expiry} days
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedAudit.missingItems.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Missing Items ({selectedAudit.missingItems.length})
              </h2>
              <div className="space-y-3">
                {selectedAudit.missingItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
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
                        <p className="font-medium text-foreground">
                          Upload {item.year} {item.jurisdiction} {item.doc_type} for {item.entity_name}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">{item.entity_type} / Compliance</p>
                      </div>
                    </div>
                    <Button size="sm">Resolve</Button>
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
              <h2 className="text-lg font-semibold text-foreground">Complete Items ({selectedAudit.totalCompleted})</h2>
              {showComplete ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {showComplete && (
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  {selectedAudit.totalCompleted} of {selectedAudit.totalRequired} required documents are properly
                  covered for the audit period.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-xl font-semibold">Upload Auditor Requirements</h2>
              <p className="text-sm text-muted-foreground">Upload official audit checklist from auditor</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop file or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports PDF, Excel, CSV</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1">Upload</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
