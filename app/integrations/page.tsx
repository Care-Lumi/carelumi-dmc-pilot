"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Check, ExternalLink, Plus } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { NewIntegrationModal } from "@/components/dashboard/new-integration-modal"

const integrations = [
  {
    category: "Practice Management / EHR Systems",
    description: "Connect your practice management and EHR systems",
    services: [
      { name: "TherapyNotes", description: "Mental health practice management and billing", status: "not_connected" },
      { name: "Raintree", description: "Rehab therapy practice management", status: "not_connected" },
      { name: "WebPT", description: "Physical therapy EMR and practice management", status: "not_connected" },
      { name: "Motivity", description: "ABA practice management software", status: "not_connected" },
      { name: "TherapyPM", description: "Therapy practices management platform", status: "not_connected" },
      {
        name: "SimplePractice",
        description: "EHR and billing platform for mental health practices",
        status: "not_connected",
      },
    ],
  },
  {
    category: "Billing & Claims",
    description: "Connect your billing systems to track revenue and claims data",
    services: [
      {
        name: "Availity",
        description: "Claims submission and payer enrollment verification",
        status: "connected",
        lastSync: "2 hours ago",
      },
      { name: "OfficeAlly", description: "Medical billing and practice management", status: "not_connected" },
      { name: "Kareo", description: "Cloud-based medical billing software", status: "not_connected" },
      { name: "Athenahealth", description: "Medical billing and practice management", status: "not_connected" },
      { name: "DrChrono", description: "EHR and medical billing platform", status: "not_connected" },
      { name: "NextGen Healthcare", description: "Healthcare IT solutions and billing", status: "not_connected" },
      { name: "eClinicalWorks", description: "Healthcare IT and RCM solutions", status: "not_connected" },
    ],
  },
  {
    category: "Credentialing & Verification",
    description: "Automate credentialing processes and verification",
    services: [
      {
        name: "CAQH ProView",
        description: "Provider data management and credentialing",
        status: "connected",
        lastSync: "1 day ago",
      },
      { name: "Change Healthcare", description: "Payer enrollment and credentialing portal", status: "not_connected" },
      { name: "Medallion", description: "Modern credentialing platform", status: "not_connected" },
      { name: "MD-Staff", description: "Credentialing and privileging software", status: "not_connected" },
      { name: "Andros", description: "Provider credentialing solutions", status: "not_connected" },
      { name: "Neolytix", description: "Credentialing and enrollment services", status: "not_connected" },
      { name: "CredentialStream", description: "Healthcare credentialing platform", status: "not_connected" },
      {
        name: "Prime Healthcare Services",
        description: "Credentialing and provider enrollment",
        status: "not_connected",
      },
    ],
  },
  {
    category: "Payer Portal Platforms",
    description: "Connect to multi-payer portals for enrollment tracking",
    services: [
      {
        name: "Availity",
        description: "Multi-payer portal for enrollment and claims",
        status: "connected",
        lastSync: "2 hours ago",
      },
      { name: "Change Healthcare", description: "Multi-payer connectivity platform", status: "not_connected" },
      { name: "Waystar", description: "Revenue cycle management platform", status: "not_connected" },
      {
        name: "CAQH ProView",
        description: "Provider database and credentialing",
        status: "connected",
        lastSync: "1 day ago",
      },
      {
        name: "Optum Provider Express",
        description: "Provider data management and credentialing",
        status: "not_connected",
      },
    ],
  },
  {
    category: "License Verification",
    description: "Automated license verification and monitoring",
    services: [
      {
        name: "State Licensing Boards",
        description: "Direct integration with state licensing databases",
        status: "connected",
        lastSync: "6 hours ago",
      },
      {
        name: "NPPES NPI Registry",
        description: "National Provider Identifier registry for U.S. healthcare providers",
        status: "not_connected",
      },
      { name: "Certemy", description: "Automated license tracking and verification", status: "not_connected" },
      { name: "EverCheck", description: "License and credential monitoring", status: "not_connected" },
      { name: "ProviderTrust", description: "Provider screening and monitoring", status: "not_connected" },
    ],
  },
  {
    category: "Document Storage",
    description: "Cloud storage for credential documents and records",
    services: [
      { name: "Google Drive", description: "Store and organize credential documents", status: "not_connected" },
      { name: "Dropbox", description: "Secure document storage and sharing", status: "not_connected" },
      { name: "Microsoft OneDrive", description: "Cloud storage and file collaboration", status: "not_connected" },
      { name: "Box", description: "Enterprise content management platform", status: "not_connected" },
      { name: "iCloud Drive", description: "Apple cloud storage service", status: "not_connected" },
    ],
  },
  {
    category: "HR / Payroll Systems",
    description: "Sync staff information and background checks",
    services: [
      { name: "Gusto", description: "Payroll, benefits, and HR management", status: "not_connected" },
      { name: "ADP Workforce Now", description: "Comprehensive HR and payroll solution", status: "not_connected" },
      { name: "BambooHR", description: "HR software for growing businesses", status: "not_connected" },
      { name: "Rippling", description: "All-in-one HR, IT, and finance platform", status: "not_connected" },
      { name: "Paychex", description: "Payroll and HR solutions", status: "not_connected" },
      { name: "Zenefits", description: "Cloud-based HR platform", status: "not_connected" },
    ],
  },
  {
    category: "Accounting",
    description: "Connect accounting systems for financial tracking",
    services: [
      { name: "QuickBooks", description: "Accounting software for small businesses", status: "not_connected" },
      { name: "Xero", description: "Cloud-based accounting platform", status: "not_connected" },
      { name: "Sage", description: "Business management software", status: "not_connected" },
    ],
  },
  {
    category: "Communication",
    description: "Receive alerts and notifications in your team tools",
    services: [
      { name: "Slack", description: "Team communication and alerts", status: "not_connected" },
      { name: "Microsoft Teams", description: "Team collaboration and messaging", status: "not_connected" },
    ],
  },
]

type FilterMode = "all" | "connected" | "recommended"

function IntegrationsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allServicesFlat = integrations.flatMap((cat) =>
    cat.services.map((s) => ({
      ...s,
      category: cat.category,
    })),
  )

  const connectedServices = allServicesFlat.filter((s) => s.status === "connected")

  const recommendedNames = new Set(["TherapyNotes", "Availity", "CAQH ProView"])

  const baseList =
    selectedCategory === null ? integrations : integrations.filter((cat) => cat.category === selectedCategory)

  const filteredIntegrations = baseList.filter((cat) => {
    if (filterMode === "connected") {
      return cat.services.some((s) => s.status === "connected")
    }
    if (filterMode === "recommended") {
      return cat.services.some((s) => recommendedNames.has(s.name))
    }
    return true
  })

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect CareLumi with your existing tools and services
                </p>
              </div>
              <button
                onClick={() => setShowNewIntegrationModal(true)}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Integration
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-md border border-border bg-card p-1 text-xs">
                {(["all", "connected", "recommended"] as FilterMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`rounded-md px-3 py-1 font-medium capitalize ${
                      filterMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <select
                value={selectedCategory ?? ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="h-9 rounded-md border border-border bg-card px-3 text-xs text-foreground"
              >
                <option value="">All categories</option>
                {integrations.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Connected systems summary */}
          {connectedServices.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Your connected systems</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {connectedServices.map((service) => (
                  <div
                    key={`${service.category}-${service.name}`}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{service.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        <Check className="h-3 w-3" />
                        Connected
                      </span>
                    </div>
                    {service.lastSync && (
                      <p className="text-[11px] text-muted-foreground">Last synced: {service.lastSync}</p>
                    )}
                    <p className="mt-2 text-[11px] text-muted-foreground">Category: {service.category}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Integration categories (accordion-style) */}
          <div className="space-y-6">
            {filteredIntegrations.map((category) => {
              const isExpanded = expandedCategories[category.category] ?? false
              const servicesToShow = isExpanded ? category.services : category.services.slice(0, 3)

              return (
                <section key={category.category} className="border-b border-border pb-6 last:border-0">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="mb-3 flex w-full items-center justify-between"
                  >
                    <div className="text-left">
                      <h2 className="text-sm font-semibold text-foreground">{category.category}</h2>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{category.services.length} integrations</span>
                  </button>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {servicesToShow.map((service) => (
                      <div
                        key={service.name}
                        className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-sm font-semibold text-foreground">{service.name}</h3>
                          {service.status === "connected" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              <Check className="h-3 w-3" />
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                        {service.status === "connected" && service.lastSync && (
                          <p className="mt-2 text-[11px] text-muted-foreground">Last synced: {service.lastSync}</p>
                        )}
                        {service.status !== "connected" && (
                          <p className="mt-2 text-[11px] text-muted-foreground">Not connected</p>
                        )}

                        {service.status === "connected" ? (
                          <div className="mt-3 flex gap-2">
                            <button className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                              Configure
                            </button>
                            <button className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                              Disconnect
                            </button>
                          </div>
                        ) : (
                          <>
                            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                              Connect
                              <ExternalLink className="h-3 w-3" />
                            </button>
                            <button className="mt-2 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                              Learn more
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {category.services.length > 3 && (
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="mt-3 text-xs font-medium text-primary hover:text-primary/80"
                    >
                      {isExpanded ? "Show fewer integrations" : `View all ${category.services.length} integrations`}
                    </button>
                  )}
                </section>
              )
            })}
          </div>
        </div>
      </main>

      <NewIntegrationModal isOpen={showNewIntegrationModal} onClose={() => setShowNewIntegrationModal(false)} />
    </div>
  )
}

export default function IntegrationsPage() {
  return <IntegrationsContent />
}
