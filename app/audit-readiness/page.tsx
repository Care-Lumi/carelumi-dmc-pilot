"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { useOrg } from "@/lib/contexts/org-context"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

type AuditType = "general" | "state" | "fire" | "payer"

function AuditReadinessContent() {
  const { org } = useOrg()
  const sandboxData = getSandboxDataForOrg(org?.type || "surgery_center")

  const [selectedAuditType, setSelectedAuditType] = useState<AuditType>("general")
  const [showComplete, setShowComplete] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })

  const auditScores = {
    general: 77,
    state: 64,
    fire: 82,
    payer: 70,
  }

  const completeItemsFromSandbox = sandboxData.SANDBOX_AUDIT_COMPLETE_ITEMS.map((item, index) => ({
    id: `c${index + 1}`,
    category: "Compliance",
    item: item,
    status: "complete" as const,
    auditTypes: ["general" as const],
  }))

  const allItems = [...sandboxData.SANDBOX_AUDIT_MISSING, ...completeItemsFromSandbox]

  const filteredItems = allItems.filter((item) => item.auditTypes.includes(selectedAuditType))
  const missingItems = filteredItems.filter((item) => item.status === "incomplete")
  const completeItems = filteredItems.filter((item) => item.status === "complete")

  const auditTypeCards = [
    { type: "general" as AuditType, label: "General Audit", score: auditScores.general, color: "text-green-600" },
    { type: "state" as AuditType, label: "State Regulatory", score: auditScores.state, color: "text-yellow-600" },
    { type: "fire" as AuditType, label: "Facility Audit", score: auditScores.fire, color: "text-green-600" },
    { type: "payer" as AuditType, label: "Payer-Specific", score: auditScores.payer, color: "text-yellow-600" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold text-foreground">Audit Readiness</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor compliance gaps across all audit types</p>
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
                  <div className={cn("text-3xl font-bold", audit.color)}>{audit.score}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Ready</p>
                </CardContent>
              </Card>
            ))}
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
              {showComplete ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
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
    </div>
  )
}

export default function AuditReadinessPage() {
  return <AuditReadinessContent />
}
