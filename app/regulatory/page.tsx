"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { ClipActionModal } from "@/components/dashboard/modals/clip-action-modal"
import { SANDBOX_REGULATORY_UPDATES } from "@/lib/data/sandbox-data"
import { ChevronLeft, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SandboxPageOverlay } from "@/components/sandbox-page-overlay"
import { cn } from "@/lib/utils"

const setClipContext = (context) => {
  // Placeholder for setClipContext implementation
  console.log(context)
}

export default function RegulatoryUpdatesPage() {
  return <RegulatoryUpdatesContent />
}

function RegulatoryUpdatesContent() {
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

  const [searchQuery, setSearchQuery] = useState("")
  const [impactFilter, setImpactFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [showClipModal, setShowClipModal] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null)

  const regulatoryUpdates = SANDBOX_REGULATORY_UPDATES

  const totalUpdates = regulatoryUpdates.length
  const criticalPending = regulatoryUpdates.filter((u) => u.type === "critical").length
  const requiresDocumentation = regulatoryUpdates.filter((u) => u.documentsMissing.length > 0).length

  const locations = ["all", "DMC Austin Surgery Center", "DMC San Marcos ASC"]

  // Filter updates based on selections
  const filteredUpdates = regulatoryUpdates.filter((update) => {
    const matchesImpact = impactFilter === "all" || update.type === impactFilter
    const matchesSource = sourceFilter === "all" || update.source === sourceFilter
    const matchesLocation = selectedLocation === "all" || update.location === selectedLocation
    const matchesSearch = searchQuery === "" || update.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesImpact && matchesSource && matchesLocation && matchesSearch
  })

  // Chat with Clip action
  const handleUseClip = (update: any) => {
    setSelectedUpdate(update)
    setShowClipModal(true)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <SandboxPageOverlay
        pageKey="regulatory-updates"
        title="Preview Regulatory Updates in sandbox mode"
        description="This page shows sample federal and state updates so you can see how CareLumi surfaces critical changes and tracks required documentation. In your trial, your uploaded documents are stored in Documents & Reports. Live regulatory monitoring is available on paid plans."
        featureName="Regulatory"
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
              <h1 className="text-3xl font-semibold text-foreground">Regulatory Updates</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Stay compliant with federal and state regulatory changes
              </p>
            </div>
            <button className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Mark All Read
            </button>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Regulatory Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left">{totalUpdates}</div>
                <p className="text-xs text-muted-foreground">Active regulatory updates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Updates Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-red-600">{criticalPending}</div>
                <p className="text-xs text-muted-foreground">Require immediate action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Updates Requiring Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-amber-600">{requiresDocumentation}</div>
                <p className="text-xs text-muted-foreground">Missing forms or SOPs</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search regulatory updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="informational">Informational</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Sources</option>
              <option value="Texas Medicaid">Texas Medicaid</option>
              <option value="CMS">CMS</option>
              <option value="Texas DSHS">Texas DSHS</option>
            </select>
          </div>

          {/* Table Format */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Update</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-muted-foreground">Impact</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-muted-foreground">
                        Effective Date
                      </th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUpdates.map((update) => {
                      const isPending = update.documentsMissing.length > 0
                      const isOverdue = update.daysUntilEffective < 7

                      return (
                        <tr key={update.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{update.title}</td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`text-sm font-medium ${
                                update.type === "critical"
                                  ? "text-red-600"
                                  : update.type === "warning"
                                    ? "text-amber-600"
                                    : "text-blue-600"
                              }`}
                            >
                              {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{update.description}</td>
                          <td className="px-6 py-4 text-center text-sm text-foreground">
                            {new Date(update.effectiveDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleUseClip(update)}
                              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                            >
                              Use Clip
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {selectedUpdate && (
        <ClipActionModal
          isOpen={showClipModal}
          onClose={() => {
            setShowClipModal(false)
            setSelectedUpdate(null)
          }}
          provider="DMC Surgery Centers"
          payer={selectedUpdate.source}
          status={selectedUpdate.title}
        />
      )}
    </div>
  )
}
