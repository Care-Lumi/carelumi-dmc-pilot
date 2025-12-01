"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { QuickActionsBar } from "@/components/dashboard/quick-actions-bar"
import { RevenueAtRiskCard } from "@/components/dashboard/revenue-at-risk-card"
import { CredentialingPipelineCard } from "@/components/dashboard/credentialing-pipeline-card"
import { ExpiringSoonCard } from "@/components/dashboard/expiring-soon-card"
import { AuditReadinessCard } from "@/components/dashboard/audit-readiness-card"
import { OnboardingWelcome } from "@/components/dashboard/onboarding-welcome"
import { TourOverlay } from "@/components/dashboard/tour-overlay"
import { AIProcessingModal } from "@/components/dashboard/modals/ai-processing-modal"
import { ValidateDataModal } from "@/components/dashboard/modals/validate-data-modal"
import { SendToStaffModal } from "@/components/dashboard/modals/send-to-staff-modal"
import { RenewalFormModal } from "@/components/dashboard/modals/renewal-form-modal"
import { SignatureModal } from "@/components/dashboard/modals/signature-modal"
import { SuccessModal } from "@/components/dashboard/modals/success-modal"
import { SupervisorSignatureModal } from "@/components/dashboard/modals/supervisor-signature-modal"
import { GenerateStaffLinkModal } from "@/components/dashboard/modals/generate-staff-link-modal"
import { AuditLogModal } from "@/components/dashboard/modals/audit-log-modal"
import { AttestationModal } from "@/components/dashboard/modals/attestation-modal"
import { ClipVoiceIntro } from "@/components/dashboard/clip-voice-intro"
import { cn } from "@/lib/utils"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { useOrg } from "@/lib/contexts/org-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    payerCount: 0,
    expiringCount: 0,
    loading: true,
  })
  const [refreshKey, setRefreshKey] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showClipIntro, setShowClipIntro] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    fetchMetrics()

    const hasSeenOnboarding = localStorage.getItem("carelumi_dmc_onboarding_seen")
    if (!hasSeenOnboarding) {
      setShowWelcome(true)
    }

    const handleDocumentsUpdated = () => {
      setRefreshKey((prev) => prev + 1)
    }

    const handleRestartOnboarding = () => {
      setShowWelcome(true)
    }

    window.addEventListener("documentsUpdated", handleDocumentsUpdated)
    window.addEventListener("restartOnboarding", handleRestartOnboarding)

    return () => {
      window.removeEventListener("documentsUpdated", handleDocumentsUpdated)
      window.removeEventListener("restartOnboarding", handleRestartOnboarding)
    }
  }, [refreshKey])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/documents")
      const data = await response.json()

      if (response.ok && data.documents && Array.isArray(data.documents)) {
        const payers = new Set(
          data.documents
            .filter(
              (doc: any) =>
                doc.document_type?.toLowerCase().includes("payer") ||
                doc.document_type?.toLowerCase().includes("contract"),
            )
            .map((doc: any) => doc.owner_name),
        )

        const now = new Date()
        const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

        const expiring = data.documents.filter((doc: any) => {
          if (!doc.expiration_date) return false
          const expDate = new Date(doc.expiration_date)
          return expDate > now && expDate <= sixtyDaysFromNow
        })

        const alerts = data.documents
          .filter((doc: any) => {
            return (
              doc.status === "active" &&
              doc.owner_type === "staff" &&
              (doc.urgency_level === "critical" || doc.urgency_level === "high")
            )
          })
          .map((doc: any) => ({
            id: doc.id,
            type: doc.is_valid_now ? "license_expiring" : "license_expired",
            owner_name: doc.owner_name,
            document_type: doc.document_type,
            expiration_date: doc.expiration_date,
            days_until_expiration: doc.days_until_expiration,
            license_number: doc.license_number,
            jurisdiction: doc.jurisdiction,
            urgency_level: doc.urgency_level,
          }))

        setCriticalAlerts(alerts)

        setMetrics({
          payerCount: payers.size,
          expiringCount: expiring.length,
          loading: false,
        })
      } else {
        setMetrics({ payerCount: 0, expiringCount: 0, loading: false })
      }
    } catch (error) {
      console.error("[v0] Error fetching metrics:", error)
      setMetrics({ payerCount: 0, expiringCount: 0, loading: false })
    }
  }

  const handleTakeTour = () => {
    setShowWelcome(false)
    setTimeout(() => {
      setShowClipIntro(true)
    }, 300)
  }

  const handleSkipTour = () => {
    setShowWelcome(false)
    localStorage.setItem("carelumi_dmc_onboarding_seen", "true")
  }

  const handleClipIntroComplete = () => {
    setShowClipIntro(false)
    setTimeout(() => {
      setShowTour(true)
    }, 300)
  }

  const handleClipIntroSkip = () => {
    setShowClipIntro(false)
    localStorage.setItem("carelumi_has_met_clip", "true")
    setTimeout(() => {
      setShowTour(true)
    }, 300)
  }

  const handleTourComplete = () => {
    setShowTour(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />
      <DashboardContent
        criticalAlerts={criticalAlerts}
        metrics={metrics}
        showWelcome={showWelcome}
        showClipIntro={showClipIntro}
        showTour={showTour}
        handleTakeTour={handleTakeTour}
        handleSkipTour={handleSkipTour}
        handleClipIntroComplete={handleClipIntroComplete}
        handleClipIntroSkip={handleClipIntroSkip}
        handleTourComplete={handleTourComplete}
      />
    </div>
  )
}

function DashboardContent({
  criticalAlerts,
  metrics,
  showWelcome,
  showClipIntro,
  showTour,
  handleTakeTour,
  handleSkipTour,
  handleClipIntroComplete,
  handleClipIntroSkip,
  handleTourComplete,
}: any) {
  const { org } = useOrg()
  const [sandboxData, setSandboxData] = useState<any>(null)

  useEffect(() => {
    if (org?.type) {
      const data = getSandboxDataForOrg(org.type)
      setSandboxData(data)
    }
  }, [org])

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true"
    }
    return false
  })

  const [actionItems, setActionItems] = useState<any[]>([])

  useEffect(() => {
    if (!sandboxData?.SANDBOX_DOCUMENTS) return

    const now = new Date()
    const sixtyDaysFromNow = new Date()
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60)

    const items = sandboxData.SANDBOX_DOCUMENTS.filter((doc: any) => {
      if (!doc.expiration_date) return false
      const expDate = new Date(doc.expiration_date)
      return expDate <= sixtyDaysFromNow
    })
      .map((doc: any) => {
        const expDate = new Date(doc.expiration_date)
        const daysUntil = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return {
          id: doc.id,
          owner_name: doc.owner_name,
          doc_type: doc.document_type,
          expiration_date: doc.expiration_date,
          days_until_expiry: daysUntil,
          is_expired: daysUntil < 0,
          severity: daysUntil < 0 ? "expired" : "expiring",
        }
      })
      .sort((a: any, b: any) => {
        if (a.is_expired && !b.is_expired) return -1
        if (!a.is_expired && b.is_expired) return 1
        return a.days_until_expiry - b.days_until_expiry
      })

    setActionItems(items)
  }, [sandboxData])

  useEffect(() => {
    const handleCollapsedChange = (e: CustomEvent) => {
      setCollapsed(e.detail)
    }
    window.addEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    return () => {
      window.removeEventListener("sidebar-collapsed-changed" as any, handleCollapsedChange)
    }
  }, [])

  if (!sandboxData) {
    return (
      <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
        <div className="mx-auto max-w-[1400px] flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  const topActionItems = actionItems.slice(0, 3)
  const remainingCount = actionItems.length - 3

  return (
    <>
      <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
        <div className="mx-auto max-w-[1400px] space-y-8">
          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-foreground">Compliance Hub</h1>
            <div data-tour="upload-documents">
              <QuickActionsBar />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6" data-tour="dashboard-metrics">
            <RevenueAtRiskCard locked />
            <CredentialingPipelineCard totalPayers={metrics.payerCount} loading={metrics.loading} />
            <ExpiringSoonCard total={metrics.expiringCount} loading={metrics.loading} />
            <AuditReadinessCard locked={!org?.useRealData?.auditReadiness} />
          </div>

          {actionItems.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Action Items</h2>
              {topActionItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "border-2",
                    item.is_expired ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50",
                  )}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            item.is_expired ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {item.is_expired ? "EXPIRED" : "EXPIRING"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {item.doc_type} - {item.owner_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.is_expired
                              ? `Expired ${Math.abs(item.days_until_expiry)} days ago`
                              : `Expires in ${item.days_until_expiry} days`}
                          </p>
                        </div>
                      </div>
                      <Button size="sm">Resolve</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {remainingCount > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          Additional licenses expiring soon - {remainingCount} more
                        </p>
                        <p className="text-sm text-muted-foreground">View all in Documents & Reports</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => (window.location.href = "/documents")}>
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <OnboardingWelcome isOpen={showWelcome} onTakeTour={handleTakeTour} onSkip={handleSkipTour} />
      <ClipVoiceIntro isOpen={showClipIntro} onComplete={handleClipIntroComplete} onSkip={handleClipIntroSkip} />
      <TourOverlay isActive={showTour} onComplete={handleTourComplete} />

      <AIProcessingModal />
      <ValidateDataModal />
      <SendToStaffModal />
      <RenewalFormModal />
      <SignatureModal />
      <SuccessModal />
      <SupervisorSignatureModal />
      <GenerateStaffLinkModal />
      <AuditLogModal />
      <AttestationModal />
    </>
  )
}
