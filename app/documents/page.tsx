"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { GenerateAuditModal } from "@/components/dashboard/generate-audit-modal"
import { UploadDocumentsModal } from "@/components/dashboard/upload-documents-modal"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, Building2, UserCheck, BookOpen, X, Check, AlertTriangle, Search } from "lucide-react"
import Image from "next/image"

const allDocuments = [
  {
    id: 1,
    name: "Dr. Michael Chen - IL OTA License",
    category: "Staff Credentials",
    status: "expired",
    expiryDate: "10/15/2025",
    staffMember: "Dr. Michael Chen",
  },
  {
    id: 2,
    name: "Dr. Sarah Martinez - IL LSW License",
    category: "Staff Credentials",
    status: "expiring",
    expiryDate: "12/31/2025",
    staffMember: "Dr. Sarah Martinez",
  },
  {
    id: 3,
    name: "Marcus Johnson - CPR Certificate",
    category: "Staff Credentials",
    status: "expiring",
    expiryDate: "12/20/2025",
    staffMember: "Marcus Johnson",
  },
  {
    id: 4,
    name: "County Care - Provider Agreement",
    category: "Payer Contracts",
    status: "missing",
    expiryDate: "N/A",
  },
  {
    id: 5,
    name: "Meridian Health - Credentialing Application",
    category: "Payer Contracts",
    status: "expiring",
    expiryDate: "12/25/2025",
  },
  {
    id: 6,
    name: "Chicago Main - IL Behavioral Health License",
    category: "Facility Licenses",
    status: "expired",
    expiryDate: "09/30/2025",
  },
  {
    id: 7,
    name: "Naperville - Fire Safety Certificate",
    category: "Facility Licenses",
    status: "missing",
    expiryDate: "N/A",
  },
  {
    id: 8,
    name: "Oak Park - Building Inspection Report",
    category: "Facility Licenses",
    status: "expiring",
    expiryDate: "12/15/2025",
  },
  {
    id: 9,
    name: "Emergency Response Policy",
    category: "Policies & SOPs",
    status: "expiring",
    expiryDate: "12/28/2025",
  },
  {
    id: 10,
    name: "Dr. Emily Chen - Background Check",
    category: "Staff Credentials",
    status: "missing",
    expiryDate: "N/A",
    staffMember: "Dr. Emily Chen",
  },
]

const documentCategories = [
  {
    id: "staff",
    name: "Staff Credentials",
    description: "Licenses, certifications, and background checks.",
    icon: UserCheck,
    sources: ["TherapyNotes", "IDFPR Portal", "Manual Upload"],
    checklistCta: "View checklist",
    documentsCta: "View staff docs",
    checklistItems: [
      { label: "License on file", status: "complete" as const, count: 15 },
      { label: "Background check", status: "warning" as const, count: 2, detail: "2 missing" },
      { label: "TB test", status: "warning" as const, count: 1, detail: "1 expiring soon" },
      { label: "CPR / First Aid", status: "complete" as const, count: 15 },
      { label: "CEU certificates", status: "warning" as const, count: 3, detail: "3 missing" },
    ],
  },
  {
    id: "payer",
    name: "Payer Contracts",
    description: "Contracts, fee schedules, and credentialing packets.",
    icon: Building2,
    sources: ["CAQH", "Availity", "Payer portals"],
    checklistCta: "View checklist",
    documentsCta: "View payer docs",
    checklistItems: [
      { label: "Active contracts on file", status: "complete" as const, count: 5 },
      { label: "Fee schedules current", status: "complete" as const, count: 5 },
      { label: "Credentialing packets", status: "warning" as const, count: 1, detail: "1 in progress" },
    ],
  },
  {
    id: "facility",
    name: "Facility Licenses",
    description: "Site licenses, inspections, and safety certificates.",
    icon: Building2,
    sources: ["State portals", "City inspectors", "Manual upload"],
    checklistCta: "View checklist",
    documentsCta: "View facility docs",
    checklistItems: [
      { label: "Facility licenses current", status: "warning" as const, count: 1, detail: "1 expired" },
      { label: "Fire safety inspection", status: "warning" as const, count: 1, detail: "1 missing" },
      { label: "Building inspection", status: "warning" as const, count: 1, detail: "1 expiring soon" },
    ],
  },
  {
    id: "policies",
    name: "Policies & SOPs",
    description: "Internal policies, procedures, and onboarding docs.",
    icon: BookOpen,
    sources: ["Internal drive", "Manual upload"],
    checklistCta: "View checklist",
    documentsCta: "View policy docs",
    checklistItems: [
      { label: "Compliance policies", status: "complete" as const, count: 12 },
      { label: "Staff onboarding docs", status: "complete" as const, count: 8 },
      { label: "Audit procedures", status: "warning" as const, count: 1, detail: "1 update pending" },
    ],
  },
]

function DocumentsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"expired" | "missing" | "expiring" | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>("staff")

  useEffect(() => {
    window.scrollTo(0, 0)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const staffFilter = params.get("staff")
      if (staffFilter) {
        setSelectedCategory("staff")
      }
    }
  }, [])

  const expiredDocs = allDocuments.filter((d) => d.status === "expired").length
  const missingDocs = allDocuments.filter((d) => d.status === "missing").length
  const expiringDocs = allDocuments.filter((d) => d.status === "expiring").length

  const handleMetricCardClick = (type: "expired" | "missing" | "expiring") => {
    setStatusFilter(statusFilter === type ? null : type)
  }

  const filteredDocuments = statusFilter ? allDocuments.filter((doc) => doc.status === statusFilter) : []

  const selectedCategoryData = documentCategories.find((cat) => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-semibold text-foreground">Documents & Reports</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage and organize all compliance documents</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Generate Audit
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            <Card
              className={`cursor-pointer transition-all ${
                statusFilter === "expired" ? "ring-2 ring-red-600 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => handleMetricCardClick("expired")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Expired Documents</h3>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-destructive-foreground">{expiredDocs}</div>
                <p className="text-xs text-muted-foreground">need immediate attention</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                statusFilter === "missing" ? "ring-2 ring-amber-600 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => handleMetricCardClick("missing")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Missing Documents</h3>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-destructive-foreground">{missingDocs}</div>
                <p className="text-xs text-muted-foreground">not yet uploaded</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                statusFilter === "expiring" ? "ring-2 ring-yellow-600 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => handleMetricCardClick("expiring")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Expiring Soon</h3>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-yellow-600">{expiringDocs}</div>
                <p className="text-xs text-muted-foreground">within next 60 days</p>
              </CardContent>
            </Card>
          </div>

          {statusFilter && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground capitalize">{statusFilter} Documents</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <button
                    onClick={() => setStatusFilter(null)}
                    className="rounded-full p-1 hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-muted-foreground">{doc.category}</p>
                          {doc.staffMember && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">{doc.staffMember}</p>
                            </>
                          )}
                          {doc.expiryDate !== "N/A" && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">Expires: {doc.expiryDate}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-medium ${
                            doc.status === "expired"
                              ? "text-red-600"
                              : doc.status === "missing"
                                ? "text-amber-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {doc.status === "expired"
                            ? "Expired"
                            : doc.status === "missing"
                              ? "Missing"
                              : "Expiring Soon"}
                        </span>
                        <button
                          onClick={() => {
                            if (doc.id === 1) {
                              // Dr. Chen's OTA License
                              setShowLicenseModal(true)
                            } else if (doc.status === "missing") {
                              setShowUploadModal(true)
                            }
                          }}
                          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          {doc.status === "missing" ? "Upload" : "View"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Document Repository</h2>
            <p className="text-sm text-muted-foreground">Browse everything Clip has pulled in from your systems.</p>
          </div>

          <div className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search documents by name, type, or staff member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
            {documentCategories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {category.sources.map((source) => (
                          <span
                            key={source}
                            className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2"></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedCategoryData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{selectedCategoryData.name} checklist</h2>
                    <p className="text-sm text-muted-foreground">Review what's complete and what needs attention</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={() => setShowGenerateModal(true)}
                    >
                      Generate audit packet
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Required items</h3>
                    <div className="space-y-2">
                      {selectedCategoryData.checklistItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                        >
                          <div className="flex items-center gap-3">
                            {item.status === "complete" ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                            ) : (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                                <AlertTriangle className="h-3 w-3 text-amber-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
                            </div>
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              item.status === "complete" ? "text-green-600" : "text-amber-600"
                            }`}
                          >
                            {item.count} {item.status === "complete" ? "complete" : "items"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={showLicenseModal} onOpenChange={setShowLicenseModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dr. Michael Chen - IL OTA License</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border overflow-hidden">
              <Image
                src="/images/samuel-ota-license.jpg"
                alt="Dr. Michael Chen Texas Medical License"
                width={800}
                height={1000}
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLicenseModal(false)}
                className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
              <button className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Download
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showUploadModal && <UploadDocumentsModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />}
      {showGenerateModal && (
        <GenerateAuditModal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} />
      )}
    </div>
  )
}

export default function DocumentsPage() {
  return <DocumentsContent />
}
