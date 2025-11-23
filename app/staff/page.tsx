"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { staffMembers } from "@/lib/placeholder-data"
import { ChevronLeft, Bell, Mic } from "lucide-react"
import { AddStaffModal } from "@/components/dashboard/add-staff-modal"
import { AuditLogModal } from "@/components/dashboard/modals/audit-log-modal"
import { StaffActionsModal } from "@/components/dashboard/staff-actions-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function StaffCredentialsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const totalStaff = staffMembers.length
  const expiringIn30Days = staffMembers.filter((staff) => {
    return (
      staff.licenses.some((license) => license.daysUntilExpiration <= 30) ||
      staff.certifications.some(
        (cert) => cert.status === "expiring" && cert.daysUntilExpiration && cert.daysUntilExpiration <= 30,
      )
    )
  }).length
  const expiringIn60Days = staffMembers.filter((staff) => {
    return (
      staff.licenses.some((license) => license.daysUntilExpiration > 30 && license.daysUntilExpiration <= 60) ||
      staff.certifications.some(
        (cert) =>
          cert.status === "expiring" &&
          cert.daysUntilExpiration &&
          cert.daysUntilExpiration > 30 &&
          cert.daysUntilExpiration <= 60,
      )
    )
  }).length

  const sortedStaff = [...staffMembers].sort((a, b) => {
    if (a.id === "7") return -1
    if (b.id === "7") return 1
    return 0
  })

  const filteredStaff = sortedStaff.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || staff.role === roleFilter

    let matchesStatus = true
    if (statusFilter !== "all") {
      matchesStatus = staff.status === statusFilter
    }

    return matchesSearch && matchesRole && matchesStatus
  })

  const roles = ["all", ...Array.from(new Set(staffMembers.map((s) => s.role)))]
  const statuses = ["all", "compliant", "expiring"]

  const handleNotifyAll = () => {
    alert("Renewal reminders sent to all staff members with expiring credentials")
  }

  const handleViewActions = (staff: any) => {
    setSelectedStaff(staff)
    setShowActionsModal(true)
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
                  onClick={handleNotifyAll}
                  className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Bell className="h-4 w-4" />
                  Notify All Staff
                </button>
                <button
                  onClick={() => setShowAddStaffModal(true)}
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "Filter by: Role" : role}
                  </option>
                ))}
              </select>
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
              <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr] gap-4 border-b border-border px-6 py-4 text-sm font-medium text-muted-foreground">
                <div>Staff Member</div>
                <div>Role</div>
                <div>Status</div>
                <div>Update</div>
                <div>Actions</div>
              </div>

              {filteredStaff.map((staff) => {
                const expiringLicense = staff.licenses.find((l) => l.daysUntilExpiration < 60)
                const expiringCert = staff.certifications.find((c) => c.status === "expiring")

                return (
                  <div
                    key={staff.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr] gap-4 border-b border-border px-6 py-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{staff.name}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-foreground">{staff.role}</span>
                    </div>
                    <div className="flex items-center">
                      {staff.status === "expiring" ? (
                        expiringLicense && expiringLicense.daysUntilExpiration <= 30 ? (
                          <span className="text-sm font-medium text-destructive-foreground">
                            Expiring in &lt; 30 Days
                          </span>
                        ) : expiringLicense && expiringLicense.daysUntilExpiration <= 60 ? (
                          <span className="text-sm font-medium text-amber-600">Expiring in &lt; 60 Days</span>
                        ) : (
                          <span className="text-sm font-medium text-amber-600">Expiring in &lt; 60 Days</span>
                        )
                      ) : (
                        <span className="text-sm font-medium text-green-600">Compliant</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {expiringLicense ? (
                        <p className="text-sm text-muted-foreground">
                          License expires: {new Date(expiringLicense.expiresAt).toLocaleDateString()}
                        </p>
                      ) : expiringCert ? (
                        <p className="text-sm text-muted-foreground">
                          {expiringCert.type} expires: {new Date(expiringCert.expiresAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">All credentials current</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (staff.id === "7") {
                            handleViewActions(staff)
                          } else {
                            router.push(`/staff/${staff.id}`)
                          }
                        }}
                        className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        View
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      <AuditLogModal isOpen={showAuditLog} onClose={() => setShowAuditLog(false)} />
      <AddStaffModal isOpen={showAddStaffModal} onClose={() => setShowAddStaffModal(false)} />
      <StaffActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        staffMember={selectedStaff || { id: "", name: "" }}
      />
    </>
  )
}

export default function StaffCredentialsPage() {
  return <StaffCredentialsContent />
}
