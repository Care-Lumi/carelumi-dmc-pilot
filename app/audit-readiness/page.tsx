"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { useOrg } from "@/lib/contexts/org-context"
import { ChevronDown, ChevronUp, Upload, FileArchive, AlertCircle, Clock, Mic, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { type AuditType, calculateAuditScore } from "@/lib/audit-requirements"
import { GenerateAuditModal } from "@/components/dashboard/generate-audit-modal"

export default function AuditReadinessPage() {
  const { org } = useOrg()
  const [sandboxData, setSandboxData] = useState<any>(null)
  const [realDocuments, setRealDocuments] = useState<any[]>([])
  const [selectedAuditType, setSelectedAuditType] = useState<AuditType>("general")
  const [showComplete, setShowComplete] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })

  const [dismissedItems, setDismissedItems] = useState<Set<string>>(() => {
    if (typeof window !== "undefined" && org?.id) {
      const stored = localStorage.getItem(`audit-dismissed-${org.id}`)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    }
    return new Set()
  })

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(["historical"]))

  useEffect(() => {
    if (org?.type) {
      const data = getSandboxDataForOrg(org.type)
      setSandboxData(data)
    }
  }, [org])

  useEffect(() => {
    const fetchRealDocuments = async () => {
      if (org?.useRealData?.auditReadiness) {
        try {
          const response = await fetch("/api/documents")
          if (response.ok) {
            const data = await response.json()
            setRealDocuments(data.documents || [])
          }
        } catch (error) {
          console.error("[v0] Failed to fetch real documents:", error)
        }
      }
    }
    fetchRealDocuments()
  }, [org])

  useEffect(() => {
    const handleCollapsedChange = (e: CustomEvent) => {
      setCollapsed(e.detail)
    }
    window.addEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    return () => {
      window.removeEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && org?.id) {
      localStorage.setItem(`audit-dismissed-${org.id}`, JSON.stringify(Array.from(dismissedItems)))
    }
  }, [dismissedItems, org?.id])

  const dismissItem = (itemKey: string) => {
    setDismissedItems((prev) => new Set([...prev, itemKey]))
  }

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  if (!sandboxData || !org) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopNav />
        <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
          <div className="mx-auto max-w-[1400px] flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading audit data...</p>
          </div>
        </main>
      </div>
    )
  }

  const useRealData = org.useRealData?.auditReadiness
  const documentsToUse = useRealData ? realDocuments : sandboxData.SANDBOX_DOCUMENTS || []

  const uniqueStaff = documentsToUse
    .filter((doc: any) => doc.owner_type === "staff")
    .reduce((acc: any[], doc: any) => {
      const staffKey = `${doc.owner_name}_${doc.jurisdiction || "default"}`
      if (!acc.find((s) => s.id === staffKey)) {
        acc.push({
          id: staffKey,
          name: doc.owner_name,
          jurisdiction: doc.jurisdiction,
        })
      }
      return acc
    }, [])

  const facilities = (sandboxData.SANDBOX_FACILITIES || []).map((f: any, idx: number) => ({
    ...f,
    id: f.id || f.name || `facility_${idx}`,
  }))

  const payers = (sandboxData.SANDBOX_PAYERS || []).map((p: any, idx: number) => ({
    ...p,
    id: p.id || p.name || `payer_${idx}`,
  }))

  const entities = {
    staff: uniqueStaff,
    facilities: facilities,
    payers: payers,
  }

  const documentsWithStaffKeys = documentsToUse.map((doc: any) => ({
    ...doc,
    owner_id: doc.owner_type === "staff" ? `${doc.owner_name}_${doc.jurisdiction || "default"}` : doc.owner_id,
  }))

  const generalAudit = calculateAuditScore("general", documentsWithStaffKeys, entities, org.type)
  const stateAudit = calculateAuditScore("state", documentsWithStaffKeys, entities, org.type)
  const facilityAudit = calculateAuditScore("facility", documentsWithStaffKeys, entities, org.type)
  const payerAudit = calculateAuditScore("payer", documentsWithStaffKeys, entities, org.type)

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

  const getFilteredItems = (items: any[], priority: string) => {
    return items
      .filter((item) => item.priority === priority)
      .filter((item) => {
        const itemKey = `${item.entity_name}_${item.doc_type}_${item.year}`
        return !dismissedItems.has(itemKey)
      })
      .filter(
        (item) =>
          searchQuery === "" ||
          item.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.doc_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.jurisdiction?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.year.toString().includes(searchQuery),
      )
  }

  const criticalItems = getFilteredItems(selectedAudit.missingItems, "critical")
  const recommendedItems = getFilteredItems(selectedAudit.missingItems, "recommended")
  const historicalItems = getFilteredItems(selectedAudit.missingItems, "historical")

  const renderMissingItem = (item: any, idx: number, canDismiss: boolean, color: "red" | "yellow" | "gray") => {
    const itemKey = `${item.entity_name}_${item.doc_type}_${item.year}`
    const colors = {
      red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
      yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600" },
      gray: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" },
    }

    return (
      <div
        key={idx}
        className={cn(
          "flex items-center justify-between rounded-lg border p-4",
          colors[color].bg,
          colors[color].border,
        )}
      >
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className={cn("mt-1 h-5 w-5 flex-shrink-0", colors[color].text)} />
          <div>
            <p className="font-medium text-foreground">
              Upload {item.year} {item.jurisdiction} {item.doc_type} for {item.entity_name}
            </p>
            <p className="text-sm text-muted-foreground capitalize">{item.entity_type} / Compliance</p>
          </div>
        </div>
        <div className="flex gap-2">
          {canDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dismissItem(itemKey)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm">Resolve</Button>
        </div>
      </div>
    )
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
              {!useRealData && (
                <p className="text-xs text-amber-600 mt-1">Demo mode - Upgrade to Pro for real document tracking</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Auditor Requirements
              </Button>
              <Button onClick={() => setShowGenerateModal(true)}>
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

          {(criticalItems.length > 0 || recommendedItems.length > 0 || historicalItems.length > 0) && (
            <>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search missing items by entity, document type, or year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {criticalItems.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Critical
                    </span>
                    Current Year ({criticalItems.length})
                  </h2>
                  <div className="space-y-3">
                    {criticalItems.map((item, idx) => renderMissingItem(item, idx, false, "red"))}
                  </div>
                </div>
              )}

              {recommendedItems.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      Recommended
                    </span>
                    Prior Year ({recommendedItems.length})
                  </h2>
                  <div className="space-y-3">
                    {recommendedItems.map((item, idx) => renderMissingItem(item, idx, true, "yellow"))}
                  </div>
                </div>
              )}

              {historicalItems.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("historical")}
                    className="mb-4 flex w-full items-center justify-between text-left"
                  >
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        Historical
                      </span>
                      2+ Years Ago ({historicalItems.length})
                    </h2>
                    {collapsedSections.has("historical") ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {!collapsedSections.has("historical") && (
                    <div className="space-y-3">
                      {historicalItems.map((item, idx) => renderMissingItem(item, idx, true, "gray"))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

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
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Audit Type</label>
                  <select className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm">
                    <option>General Audit</option>
                    <option>State Regulatory</option>
                    <option>Facility Audit</option>
                    <option>Payer-Specific</option>
                  </select>
                </div>
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

      {showGenerateModal && (
        <GenerateAuditModal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} />
      )}
    </div>
  )
}
