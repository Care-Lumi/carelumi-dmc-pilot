"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { facilities } from "@/lib/placeholder-data"
import { ChevronLeft, Mic } from "lucide-react"
import { AddLocationModal } from "@/components/dashboard/add-location-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FacilitiesPage() {
  return <FacilitiesContent />
}

function FacilitiesContent() {
  const router = useRouter()
  const [showExpansionModal, setShowExpansionModal] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)
  const [locationFilter, setLocationFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredFacilities = locationFilter === "all" ? facilities : facilities.filter((f) => f.id === locationFilter)

  const totalFacilities = facilities.length
  const uniqueStates = 1 // Changed uniqueStates from 3 to 1 since only operating in IL
  const upcomingExpirations = facilities.reduce((count, facility) => {
    const expiringLicenses = facility.licenses.filter((license) => {
      const expiresAt = new Date(license.expiresAt)
      const daysUntil = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 90
    })
    const expiringInspections = facility.inspections.filter((inspection) => {
      if (inspection.status === "scheduled") return false
      const expiresAt = new Date(inspection.expiresAt)
      const daysUntil = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 90
    })
    return count + expiringLicenses.length + expiringInspections.length
  }, 0)

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
                className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-semibold text-foreground">Facility Compliance</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track facility licenses, locations, and operating states in one place
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-10 rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Locations</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddLocationModal(true)}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                + Add Location
              </button>
              <button
                onClick={() => setShowExpansionModal(true)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Expand to New State
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left text-green-600">{totalFacilities}</div>
                <p className="text-xs text-muted-foreground">Active facilities</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-left">{uniqueStates}</div>
                <p className="text-xs text-muted-foreground">Operating states</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Expirations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{upcomingExpirations}</div>
                <p className="text-xs text-muted-foreground">Next 90 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Facilities */}
          <div className="rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Facility Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Licenses</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities
                  .filter((facility) => facility.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((facility) => (
                    <tr key={facility.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{facility.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{facility.address}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium text-green-600">
                          {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{facility.licenses.length} active</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/facilities/${facility.id}`)}
                          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Expansion Modal */}
      {showExpansionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Expand to New State</h2>
              <button
                onClick={() => setShowExpansionModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {!selectedState ? (
              <>
                <p className="mb-4 text-sm text-foreground">Which state are you expanding to?</p>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="mb-6 h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground"
                >
                  <option value="">Select State</option>
                  <option value="TX">Texas</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="FL">Florida</option>
                </select>
                <button
                  onClick={() => {
                    if (selectedState) {
                      alert("✨ Clip is analyzing Texas compliance requirements...")
                    }
                  }}
                  disabled={!selectedState}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Let Clip Handle This
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Texas Expansion Checklist</h3>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-medium text-foreground">Required Facility Licenses:</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm text-foreground">
                          <span className="text-muted-foreground">☐</span> Texas Health & Human Services Facility
                          License
                        </p>
                        <p className="ml-5 text-xs text-muted-foreground">Timeline: 90-120 days</p>
                        <div className="ml-5 mt-1 flex gap-2">
                          <button className="text-xs text-primary hover:underline">View Requirements</button>
                          <button
                            onClick={() => alert("✨ Clip is preparing your application...")}
                            className="text-xs text-primary hover:underline"
                          >
                            Let Clip Handle This
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 text-sm text-foreground">
                          <span className="text-muted-foreground">☐</span> Local Business License (city/county)
                        </p>
                        <p className="ml-5 text-xs text-muted-foreground">Timeline: 30-45 days</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-medium text-foreground">Required Staff Credentials:</h4>
                    <p className="flex items-center gap-2 text-sm text-foreground">
                      <span className="text-muted-foreground">☐</span> Texas Professional Licenses (per staff)
                    </p>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-medium text-foreground">Payer Credentialing:</h4>
                    <div>
                      <p className="flex items-center gap-2 text-sm text-foreground">
                        <span className="text-muted-foreground">☐</span> Texas Medicaid enrollment
                      </p>
                      <p className="ml-5 text-xs text-muted-foreground">Timeline: 60-90 days</p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-foreground">Estimated Timeline: 4-5 months</p>

                  <div className="flex gap-3">
                    <button className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Save Checklist
                    </button>
                    <button
                      onClick={() => alert("✨ Clip is creating your personalized expansion plan...")}
                      className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Chat with Clip
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AddLocationModal isOpen={showAddLocationModal} onClose={() => setShowAddLocationModal(false)} />
    </div>
  )
}
