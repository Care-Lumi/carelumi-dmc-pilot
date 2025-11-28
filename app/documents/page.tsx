"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { UploadDocumentsModal } from "@/components/dashboard/upload-documents-modal"
import { UpgradeOverlay } from "@/components/upgrade-overlay"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronLeft, Building2, UserCheck, BookOpen, X, Search, UploadIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Document = {
  id: string
  file_name: string
  file_url: string
  document_type: string
  owner_name: string
  owner_id: string
  owner_type: "staff" | "facility" | "payer" | "policy"
  expiration_date: string | null
  license_number: string | null
  jurisdiction: string | null
  created_at: string
  is_primary?: boolean // Added is_primary flag to track primary vs historical docs
}

function DocumentsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpgradeOverlay, setShowUpgradeOverlay] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [statusFilter, setStatusFilter] = useState<"expired" | "expiring" | "historical" | null>(null) // Added "historical" filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null)
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

  const markPrimaryDocuments = (docs: Document[]): Document[] => {
    // Group documents by (owner_id, doc_type, jurisdiction)
    const groups: Record<string, Document[]> = {}

    docs.forEach((doc) => {
      const key = `${doc.owner_id}|${doc.document_type}|${doc.jurisdiction || "none"}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(doc)
    })

    // For each group, mark the latest expiring doc as primary
    const markedDocs = docs.map((doc) => {
      const key = `${doc.owner_id}|${doc.document_type}|${doc.jurisdiction || "none"}`
      const group = groups[key]

      // Sort by expiration_date DESC (nulls last)
      const sorted = [...group].sort((a, b) => {
        if (!a.expiration_date) return 1
        if (!b.expiration_date) return -1
        return new Date(b.expiration_date).getTime() - new Date(a.expiration_date).getTime()
      })

      // First doc in sorted list is primary
      const isPrimary = sorted[0].id === doc.id

      return { ...doc, is_primary: isPrimary }
    })

    return markedDocs
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents")
      if (response.ok) {
        const data = await response.json()
        const markedDocs = markPrimaryDocuments(data.documents || [])
        setDocuments(markedDocs)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch documents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    const handleRefresh = () => {
      fetchDocuments()
    }
    window.addEventListener("documentsUpdated", handleRefresh)
    return () => window.removeEventListener("documentsUpdated", handleRefresh)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getDocumentStatus = (doc: Document) => {
    if (!doc.is_primary) return "historical"
    if (!doc.expiration_date) return null

    const expDate = new Date(doc.expiration_date)
    const now = new Date()
    // Set time to midnight for accurate day comparison
    expDate.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    const daysUntilExpiry = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    console.log("[v0] Doc status check:", {
      owner: doc.owner_name,
      expDate: doc.expiration_date,
      daysUntilExpiry,
      isPrimary: doc.is_primary,
    })

    if (daysUntilExpiry < 0) return "expired"
    if (daysUntilExpiry <= 60) return "expiring"
    return "valid"
  }

  const expiredDocs = documents.filter((d) => d.is_primary && getDocumentStatus(d) === "expired").length
  const expiringDocs = documents.filter((d) => d.is_primary && getDocumentStatus(d) === "expiring").length
  const historicalDocs = documents.filter((d) => !d.is_primary).length

  const handleMetricCardClick = (type: "expired" | "expiring" | "historical") => {
    setStatusFilter(statusFilter === type ? null : type)
  }

  const filteredDocuments = documents.filter((doc) => {
    const status = getDocumentStatus(doc)
    const matchesStatus = !statusFilter || status === statusFilter
    const matchesCategory = selectedCategory === "all" || doc.owner_type === selectedCategory
    const matchesSearch =
      !searchQuery ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })

  const documentCategories = [
    {
      id: "all",
      name: "All Documents",
      description: "View all documents across categories",
      icon: BookOpen,
    },
    {
      id: "staff",
      name: "Staff Credentials",
      description: "Licenses, certifications, and background checks",
      icon: UserCheck,
    },
    {
      id: "facility",
      name: "Facility Licenses",
      description: "Site licenses, inspections, and safety certificates",
      icon: Building2,
    },
    {
      id: "payer",
      name: "Payer Contracts",
      description: "Contracts, fee schedules, and credentialing packets",
      icon: Building2,
    },
    {
      id: "policy",
      name: "Policies & SOPs",
      description: "Internal policies, procedures, and onboarding docs",
      icon: BookOpen,
    },
  ]

  const showEmptyState = !loading && documents.length === 0

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    setDeletingDocId(docId)
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      console.log("[v0] Document deleted successfully")
      // Refresh documents list
      await fetchDocuments()
      // Notify other pages to refresh
      window.dispatchEvent(new CustomEvent("documentsUpdated"))
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete document. Please try again.")
    } finally {
      setDeletingDocId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className={cn("mt-16 p-12 transition-all duration-300", collapsed ? "ml-16" : "ml-60")}>
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
                onClick={() => setShowUpgradeOverlay(true)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Generate Audit
              </button>
            </div>
          </div>

          {showEmptyState && (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-6 mb-4">
                  <UploadIcon className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">No documents yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Upload your first document to get started. Our AI will automatically extract metadata like expiration
                  dates, license numbers, and more.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Upload Documents
                </button>
              </CardContent>
            </Card>
          )}

          {!showEmptyState && (
            <>
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
                    <div className="text-2xl font-bold text-left text-red-600">{expiredDocs}</div>
                    <p className="text-xs text-muted-foreground">need immediate attention</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${
                    statusFilter === "expiring" ? "ring-2 ring-orange-600 shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => handleMetricCardClick("expiring")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">Expiring Soon</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-left text-orange-600">{expiringDocs}</div>
                    <p className="text-xs text-muted-foreground">within next 60 days</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${
                    statusFilter === "historical" ? "ring-2 ring-gray-600 shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => handleMetricCardClick("historical")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">Audit History</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-left text-gray-600">{historicalDocs}</div>
                    <p className="text-xs text-muted-foreground">archived documents</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search Bar */}
              <div className="mb-6 flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search documents by name, type, or owner..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Category Filters */}
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5 mb-6">
                {documentCategories.map((category) => {
                  const Icon = category.icon
                  const isSelected = selectedCategory === category.id
                  const categoryCount =
                    category.id === "all"
                      ? documents.length
                      : documents.filter((d) => d.owner_type === category.id).length

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
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{categoryCount} docs</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>

              {/* Documents Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {statusFilter
                          ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Documents`
                          : "All Documents"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                    {statusFilter && (
                      <button
                        onClick={() => setStatusFilter(null)}
                        className="rounded-full p-1 hover:bg-muted transition-colors"
                      >
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr className="text-left">
                          <th className="pb-3 text-sm font-medium text-muted-foreground">Owner</th>
                          <th className="pb-3 text-sm font-medium text-muted-foreground">Type</th>
                          <th className="pb-3 text-sm font-medium text-muted-foreground">Jurisdiction</th>
                          <th className="pb-3 text-sm font-medium text-muted-foreground">Expiration</th>
                          <th className="pb-3 text-sm font-medium text-muted-foreground">License #</th>
                          <th className="pb-3 text-sm font-medium text-muted-foreground">Uploaded</th>
                          <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => {
                          const status = getDocumentStatus(doc)

                          let expirationColor = "text-muted-foreground"
                          let expirationTooltip = ""

                          if (status === "expired") {
                            expirationColor = "text-red-600 font-medium"
                            expirationTooltip = "Primary document expired - needs renewal"
                          } else if (status === "expiring") {
                            expirationColor = "text-orange-600 font-medium"
                            expirationTooltip = "Primary document expiring within 60 days"
                          } else if (status === "historical") {
                            expirationColor = "text-gray-500"
                            expirationTooltip = "Historical version - archived for audit purposes"
                          }

                          return (
                            <tr key={doc.id} className="border-b border-border last:border-0">
                              <td className="py-3 text-sm font-medium text-foreground">{doc.owner_name}</td>
                              <td className="py-3 text-sm text-muted-foreground">{doc.document_type}</td>
                              <td className="py-3 text-sm text-muted-foreground">{doc.jurisdiction || "—"}</td>
                              <td className="py-3 text-sm">
                                {doc.expiration_date ? (
                                  <span className={expirationColor} title={expirationTooltip}>
                                    {new Date(doc.expiration_date).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="py-3 text-sm text-muted-foreground">{doc.license_number || "—"}</td>
                              <td className="py-3 text-sm text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                  >
                                    View
                                  </a>
                                  <button
                                    onClick={() => handleDelete(doc.id)}
                                    disabled={deletingDocId === doc.id}
                                    className="text-sm text-red-600 hover:text-red-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete document"
                                  >
                                    {deletingDocId === doc.id ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {showUploadModal && <UploadDocumentsModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />}
      {showUpgradeOverlay && (
        <UpgradeOverlay
          feature="generate-audit"
          title="Contact Sales to Upgrade"
          description="Generate comprehensive audit packets with AI-powered document organization. Contact our sales team to unlock this premium feature."
        />
      )}
    </div>
  )
}

export default function DocumentsPage() {
  return <DocumentsContent />
}
