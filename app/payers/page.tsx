"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { SANDBOX_PAYERS } from "@/lib/data/sandbox-data"
import { ChevronLeft, Mic } from "lucide-react"
import { UpgradeOverlay } from "@/components/upgrade-overlay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipChatModal } from "@/components/dashboard/clip-chat-modal"
import { SandboxPageOverlay } from "@/components/sandbox-page-overlay"
import { PayerUpgradeModal } from "@/components/dashboard/payer-upgrade-modal"
import { cn } from "@/lib/utils"

export default function PayerCredentialingPage() {
  return <PayerCredentialingContent />
}

function PayerCredentialingContent() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })

  useEffect(() => {
    const handleCollapsedChange = (e: CustomEvent) => {
      setCollapsed(e.detail)
    }
    window.addEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    return () => {
      window.removeEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    }
  }, [])

  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddPayerModal, setShowAddPayerModal] = useState(false)
  const [showAddPayerOverlay, setShowAddPayerOverlay] = useState(false)
  const [showClipModal, setShowClipModal] = useState(false)
  const [showPayerUpgradeModal, setShowPayerUpgradeModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const payerCredentialing = SANDBOX_PAYERS

  const filteredPayers = payerCredentialing.filter((payer) => {
    const matchesStatus = statusFilter === "all" || payer.status === statusFilter
    const matchesType = typeFilter === "all" || payer.type === typeFilter
    const matchesSearch = payer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const totalPayers = payerCredentialing.length
  const activePayers = payerCredentialing.filter((p) => p.status === "active").length
  const inProgressPayers = payerCredentialing.filter((p) => p.status === "in-progress").length
  const submittedPayers = payerCredentialing.filter((p) => p.status === "submitted").length
  const missingDocsPayers = payerCredentialing.filter((p) => p.status === "missing-documents").length

  const statuses = ["all", "active", "in-progress", "missing-documents", "submitted"]
  const types = ["all", "Medicaid", "Medicaid MCO", "Commercial"]

  const handleClipReview = () => {
    setShowClipModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <SandboxPageOverlay
        pageKey="payer-credentialing"
        title="Preview Payer Credentialing in sandbox mode"
        description="This page is using example data to demonstrate how CareLumi tracks payer contracts, application stages, and 'needing attention' items. In your trial, we store your real payer documents in Documents & Reports. Managing live applications here is available on paid plans."
        featureName="Payer"
      />

      <Sidebar />
      <TopNav />

      <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-semibold text-foreground">Payer Credentialing</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage payer contracts and provider applications</p>
            </div>
            <button
              onClick={() => setShowAddPayerOverlay(true)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + Add Payer
            </button>
          </div>

          {/* Metric cards */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left">{totalPayers}</div>
                <p className="text-xs text-muted-foreground">Connected payers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-amber-600">
                  {inProgressPayers + submittedPayers + missingDocsPayers}
                </div>
                <p className="text-xs text-muted-foreground">Submitted, waiting, or under review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-destructive-foreground">{missingDocsPayers}</div>
                <p className="text-xs text-muted-foreground">Require provider or admin action</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search payers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "Filter: All"
                      : status
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                  </option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "Filter: Payer Type" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clip Integration Button */}
          <div className="mb-3"></div>

          <div className="rounded-lg border border-border bg-card">
            <div className="grid grid-cols-[2fr_1fr_1.5fr_2fr_120px] gap-4 border-b border-border px-6 py-4 text-sm font-medium text-muted-foreground">
              <div>Payer</div>
              <div>Status</div>
              <div>Stage</div>
              <div>Update</div>
              <div>Actions</div>
            </div>

            {filteredPayers.map((payer) => {
              const stage = payer.stage
              let actionLabel = "View"

              if (payer.status === "missing-documents") {
                actionLabel = "Upload Documents"
              }

              return (
                <div
                  key={payer.id}
                  className="grid grid-cols-[2fr_1fr_1.5fr_2fr_120px] gap-4 border-b border-border px-6 py-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{payer.name}</p>
                  </div>
                  <div className="flex items-center">
                    {payer.status === "active" && <span className="text-sm font-medium text-green-600">Active</span>}
                    {payer.status === "in-progress" && (
                      <span className="text-sm font-medium text-amber-600">In Progress</span>
                    )}
                    {payer.status === "missing-documents" && (
                      <span className="text-sm font-medium text-destructive-foreground">Missing Documents</span>
                    )}
                    {payer.status === "submitted" && (
                      <span className="text-sm font-medium text-blue-600">Submitted</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-foreground">{stage}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-foreground">{payer.lastUpdate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPayerUpgradeModal(true)}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {actionLabel}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {showAddPayerOverlay && (
        <UpgradeOverlay
          feature="add-payer"
          title="Contact Sales to Upgrade"
          description="Add new payers and automatically start credentialing workflows. Contact our sales team to unlock this premium feature."
        />
      )}
      <ClipChatModal
        isOpen={showClipModal}
        onClose={() => setShowClipModal(false)}
        initialMessage="Review all payers with status In Progress, Submitted, or Missing Documents. Summarize what stage each is in, who it is waiting on, and suggest next actions."
      />
      <PayerUpgradeModal isOpen={showPayerUpgradeModal} onClose={() => setShowPayerUpgradeModal(false)} />
    </div>
  )
}
