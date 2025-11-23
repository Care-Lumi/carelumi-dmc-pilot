"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { staffMembers } from "@/lib/placeholder-data"
import { ChevronLeft, Bell, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

function StaffDetailContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [staff, setStaff] = useState<(typeof staffMembers)[0] | null>(null)
  const [showNotifyModal, setShowNotifyModal] = useState(false)

  useEffect(() => {
    const member = staffMembers.find((s) => s.id === params.id)
    setStaff(member || null)
  }, [params.id])

  const handleViewAllDocuments = () => {
    router.push(`/documents?staff=${staff?.name}`)
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopNav />
        <main className="ml-60 mt-16 p-12">
          <p>Staff member not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8">
            <Link
              href="/staff"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Staff
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">{staff.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {staff.role} • {staff.location}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowNotifyModal(true)}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notify Staff
                </Button>
                <Button variant="outline" onClick={handleViewAllDocuments}>
                  <FileText className="mr-2 h-4 w-4" />
                  View All Documents
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Professional Licenses */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Professional Licenses</h2>
              {staff.licenses.map((license) => (
                <div key={license.id} className="space-y-2">
                  <p className="font-medium text-foreground">
                    {license.type} #{license.number}
                  </p>
                  <p className="text-sm text-foreground">
                    Status:{" "}
                    <span className="font-medium text-green-600">
                      {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm text-foreground">
                    Expires: {new Date(license.expiresAt).toLocaleDateString()} ({license.daysUntilExpiration} days){" "}
                    {license.daysUntilExpiration < 30 && <span className="font-medium text-yellow-600">⚠️</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last verified: {new Date(license.lastVerified).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => alert("Renewal request will be sent to staff member")}>
                      Request Renewal
                    </Button>
                    <Button variant="outline" onClick={() => alert("Upload functionality would open here")}>
                      Upload New License
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications & Training */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Certifications & Training</h2>
              <div className="space-y-4">
                {staff.certifications.map((cert) => (
                  <div key={cert.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-foreground">{cert.type}</p>
                    {cert.status === "current" && (
                      <p className="mt-1 text-sm text-green-600">
                        Status: Current (expires {new Date(cert.expiresAt).toLocaleDateString()})
                      </p>
                    )}
                    {cert.status === "expiring" && (
                      <p className="mt-1 text-sm text-yellow-600">
                        Status: Expiring (expires {new Date(cert.expiresAt).toLocaleDateString()} -{" "}
                        {cert.daysUntilExpiration} days)
                      </p>
                    )}
                    {cert.status === "in-progress" && (
                      <>
                        <p className="mt-1 text-sm text-foreground">
                          Progress: {cert.current} of {cert.required} required
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(cert.dueDate).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showNotifyModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowNotifyModal(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-white shadow-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6 bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Notify Staff Member</h2>
                <p className="text-sm text-muted-foreground mt-1">Send a notification to {staff.name}</p>
              </div>
              <button onClick={() => setShowNotifyModal(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 rounded-lg bg-blue-50 border-2 border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Staff Member</p>
                    <p className="text-sm text-blue-800 mt-1">
                      {staff.name} • {staff.role} • {staff.location}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mb-6 text-sm text-muted-foreground">
                Choose how you would like to notify this staff member:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    alert(`Email notification sent to ${staff.name}`)
                    setShowNotifyModal(false)
                  }}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left hover:border-primary hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Send Email Notification</h3>
                      <p className="text-sm text-muted-foreground">Staff will receive an email with details</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert(`SMS notification sent to ${staff.name}`)
                    setShowNotifyModal(false)
                  }}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left hover:border-primary hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Send SMS/Text Notification</h3>
                      <p className="text-sm text-muted-foreground">Staff will receive a text message</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-border bg-gray-50 p-6">
              <button
                onClick={() => setShowNotifyModal(false)}
                className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  return <StaffDetailContent params={params} />
}
