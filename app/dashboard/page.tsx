"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { QuickActionsBar } from "@/components/dashboard/quick-actions-bar"
import { RevenueAtRiskCard } from "@/components/dashboard/revenue-at-risk-card"
import { CredentialingPipelineCard } from "@/components/dashboard/credentialing-pipeline-card"
import { ExpiringSoonCard } from "@/components/dashboard/expiring-soon-card"
import { AuditReadinessCard } from "@/components/dashboard/audit-readiness-card"
import { CriticalAlerts } from "@/components/dashboard/critical-alerts"
import { SampleDataBanner } from "@/components/dashboard/sample-data-banner"
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

export default function DashboardPage() {
  const [showSampleData, setShowSampleData] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("showDmcSampleData")
    if (stored !== null) {
      setShowSampleData(stored === "true")
    }
  }, [])

  const handleRemoveSampleData = () => {
    localStorage.setItem("showDmcSampleData", "false")
    setShowSampleData(false)
  }

  const handleRestoreSampleData = () => {
    localStorage.setItem("showDmcSampleData", "true")
    setShowSampleData(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />
      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px] space-y-8">
          <SampleDataBanner
            isVisible={showSampleData}
            onRemove={handleRemoveSampleData}
            onRestore={handleRestoreSampleData}
          />
          <QuickActionsBar />

          <div className="grid grid-cols-4 gap-6">
            <RevenueAtRiskCard amount={25247} providerCount={3} trend={-18} status="high" />
            <CredentialingPipelineCard total={4} blocked={2} active={1} approved={1} />
            <ExpiringSoonCard total={5} critical={2} warning={3} />
            <AuditReadinessCard percentage={87} missingItems={3} />
          </div>

          <CriticalAlerts />
        </div>
      </main>
      <AIProcessingModal />
      <ValidateDataModal />
      <SendToStaffModal />
      <RenewalFormModal />
      <SignatureModal />
      <SupervisorSignatureModal />
      <GenerateStaffLinkModal />
      <SuccessModal />
      <AuditLogModal />
      <AttestationModal />
    </div>
  )
}
