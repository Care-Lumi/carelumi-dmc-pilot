"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { ChevronLeft, Bell, Mic, Upload } from "lucide-react"
import { UpgradeOverlay } from "@/components/upgrade-overlay"
import { AuditLogModal } from "@/components/dashboard/modals/audit-log-modal"
import { StaffActionsModal } from "@/components/dashboard/staff-actions-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadDocumentsModal } from "@/components/dashboard/upload-documents-modal"
import { RenewalStepsModal } from "@/components/dashboard/renewal-steps-modal"

type StaffLicense = {
  docType: string
  jurisdiction: string
  expiresAt: string
  licenseNumber: string | null
  documentId: string
}

type StaffMember = {
  name: string
  licenses: StaffLicense[]
  status: "compliant" | "expiring" | "expired"
  nextExpiration: string | null
  nextExpirationDoc: string | null
}

function StaffCredentialsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddStaffOverlay, setShowAddStaffOverlay] = useState(false)
  const [showNotifyAllOverlay, setShowNotifyAllOverlay] = useState(false)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showRenewalModal, setShowRenewalModal] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<any>(null)

  useEffect(() => {
    fetchStaffData()

    const handleDocumentsUpdated = () => {
      console.log("[v0] Documents updated, refreshing staff page")
      setRefreshKey((prev) => prev + 1)
    }

    window.addEventListener("documentsUpdated", handleDocumentsUpdated)
    return () => window.removeEventListener("documentsUpdated", handleDocumentsUpdated)
  }, [refreshKey])

  const fetchStaffData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/documents")
      const data = await response.json()

      const staffDocs = data.documents.filter((doc: any) => doc.owner_type === "staff" && doc.status === "active")

      // Group by staff member (owner_name)
      const staffMap = new Map<string, StaffLicense[]>()

      staffDocs.forEach((doc: any) => {
        if (!staffMap.has(doc.owner_name)) {
          staffMap.set(doc.owner_name, [])
        }
        staffMap.get(doc.owner_name)!.push({
          docType: doc.document_type,
          jurisdiction: doc.jurisdiction,
          expiresAt: doc.expiration_date,
          licenseNumber: doc.license_number,
          documentId: doc.id,
        })
      })

      // Compute staff members with aggregated status
      const staff: StaffMember[] = Array.from(staffMap.entries()).map(([name, licenses]) => {
        const now = new Date()
        const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

        let status: "compliant" | "expiring" | "expired" = "compliant"
        let nextExpiration: Date | null = null
        let nextExpirationDoc: string | null = null

        licenses.forEach((license) => {
          const expirationDate = new Date(license.expiresAt)

          // Track earliest expiration
          if (!nextExpiration || expirationDate < nextExpiration) {
            nextExpiration = expirationDate
            nextExpirationDoc = license.docType
          }

          // Compute worst status
          if (expirationDate < now) {
            status = "expired"
          } else if (status !== "expired" && expirationDate < in60Days) {
            status = "expiring"
          }
        })

        return {
          name,
          licenses,
          status,
          nextExpiration: nextExpiration?.toISOString() || null,
          nextExpirationDoc,
        }
      })

      // Sort by next expiration (most urgent first)
      staff.sort((a, b) => {
        if (!a.nextExpiration) return 1
        if (!b.nextExpiration) return -1
        return new Date(a.nextExpiration).getTime() - new Date(b.nextExpiration).getTime()
      })

      setStaffMembers(staff)
    } catch (error) {
      console.error("[v0] Error fetching staff data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const totalStaff = staffMembers.length
  const expiringIn30Days = staffMembers.filter((staff) => {
    if (!staff.nextExpiration) return false
    const daysUntil = Math.ceil((new Date(staff.nextExpiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntil <= 30 && daysUntil >= 0
  }).length
  const expiringIn60Days = staffMembers.filter((staff) => {
    if (!staff.nextExpiration) return false
    const daysUntil = Math.ceil((new Date(staff.nextExpiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntil > 30 && daysUntil <= 60
  }).length

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statuses = ["all", "compliant", "expiring", "expired"]

  const handleViewStaff = (staffName: string) => {
    // Navigate to Documents & Reports filtered by this staff member
    router.push(`/documents?owner=${encodeURIComponent(staffName)}`)
  }

  const handleViewRenewal = (staff: StaffMember) => {
    // Find the next expiring license for this staff member
    const nextLicense = staff.licenses.reduce((earliest, current) => {
      const currentExp = new Date(current.expiresAt)
      const earliestExp = new Date(earliest.expiresAt)
      return currentExp < earliestExp ? current : earliest
    })

    setSelectedLicense({
      id: nextLicense.documentId,
      owner_name: staff.name,
      document_type: nextLicense.docType,
      expiration_date: nextLicense.expiresAt,
      days_until_expiration: staff.nextExpiration
        ? Math.ceil((new Date(staff.nextExpiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      license_number: nextLicense.licenseNumber,
      jurisdiction: nextLicense.jurisdiction,
      urgency_level: staff.status === "expired" ? "critical" : staff.status === "expiring" ? "high" : "low",
    })
    setShowRenewalModal(true)
  }

  return (
    <>
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
                  className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
                <h1 className="text-3xl font-semibold text-foreground">Staff Licenses</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track and manage professional licenses and certifications
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNotifyAllOverlay(true)}
                  className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Bell className="h-4 w-4" />
                  Notify All Staff
                </button>
                <button
                  onClick={() => setShowAddStaffOverlay(true)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  + Add Staff
                </button>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Staff Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-left">{totalStaff}</div>
                  <p className="text-xs text-muted-foreground">Active staff members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring in 30 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive-foreground">{expiringIn30Days}</div>
                  <p className="text-xs text-muted-foreground">Licenses expiring soon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring in 60 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{expiringIn60Days}</div>
                  <p className="text-xs text-muted-foreground">Licenses to renew</p>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : staffMembers.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-24">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No staff licenses yet</h3>
                <p className="mb-6 text-sm text-muted-foreground">Upload staff documents to get started.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Upload Documents
                </button>
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="mb-6 flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search staff..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "Filter by: Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-lg border border-border bg-card">
                  <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] gap-4 border-b border-border px-6 py-4 text-sm font-medium text-muted-foreground">
                    <div>Staff Member</div>
                    <div>Status</div>
                    <div>Next Expiration</div>
                    <div>Actions</div>
                  </div>

                  {filteredStaff.map((staff, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[2fr_1fr_1.5fr_1fr] gap-4 border-b border-border px-6 py-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{staff.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {staff.licenses.length} {staff.licenses.length === 1 ? "license" : "licenses"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {staff.status === "expired" ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                            Expired
                          </span>
                        ) : staff.status === "expiring" ? (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                            Expiring Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            Compliant
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {staff.nextExpiration && staff.nextExpirationDoc ? (
                          <p className="text-sm text-muted-foreground">
                            {staff.nextExpirationDoc}: {new Date(staff.nextExpiration).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">No expiration dates</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewStaff(staff.name)}
                          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleViewRenewal(staff)}
                          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                        >
                          View renewal steps
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <AuditLogModal isOpen={showAuditLog} onClose={() => setShowAuditLog(false)} />
      <StaffActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        staffMember={selectedStaff || { id: "", name: "" }}
      />
      {showUploadModal && (
        <UploadDocumentsModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false)
            fetchStaffData() // Refresh staff data after upload
          }}
        />
      )}
      {showAddStaffOverlay && (
        <UpgradeOverlay
          feature="add-staff"
          title="Contact Sales to Upgrade"
          description="Add new staff members and automatically track their licensing requirements. Contact our sales team to unlock this premium feature."
        />
      )}
      {showNotifyAllOverlay && (
        <UpgradeOverlay
          feature="notify-all-staff"
          title="Contact Sales to Upgrade"
          description="Send automated renewal reminders to all staff with expiring credentials. Contact our sales team to unlock this premium feature."
        />
      )}
      {showRenewalModal && selectedLicense && (
        <RenewalStepsModal
          isOpen={showRenewalModal}
          onClose={() => {
            setShowRenewalModal(false)
            setSelectedLicense(null)
          }}
          license={selectedLicense}
        />
      )}
    </>
  )
}

export default function StaffCredentialsPage() {
  return <StaffCredentialsContent />
}
