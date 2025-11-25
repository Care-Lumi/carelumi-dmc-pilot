"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { getSandboxDataForOrg } from "@/lib/utils/sandbox"
import { useOrg } from "@/lib/contexts/org-context"
import { ChevronLeft } from "lucide-react"

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  return <FacilityDetailContent params={params} />
}

function FacilityDetailContent({ params }: { params: { id: string } }) {
  const { org } = useOrg()
  const sandboxData = getSandboxDataForOrg(org?.type || "surgery_center")
  const [facility, setFacility] = useState(() => sandboxData.SANDBOX_FACILITIES.find((f) => f.id === params.id))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!facility) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopNav />
        <main className="ml-60 mt-16 p-12 transition-all duration-300">
          <p>Facility not found</p>
        </main>
      </div>
    )
  }

  const getLicenseStatus = (expiresAt: string) => {
    const now = new Date()
    const expirationDate = new Date(expiresAt)
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiration < 0) {
      return { label: "Expired", color: "text-red-600" }
    } else if (daysUntilExpiration <= 30) {
      return { label: "Expiring Soon", color: "text-yellow-600" }
    } else {
      return { label: "Active", color: "text-green-600" }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-60 mt-16 p-12 transition-all duration-300">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/facilities"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Facilities
          </Link>

          <h1 className="mb-2 text-3xl font-semibold text-foreground">{facility.name}</h1>
          <p className="mb-2 text-sm text-muted-foreground">{facility.address}</p>
          <p className="mb-8 text-sm text-foreground">
            Status:{" "}
            <span className={`font-medium ${facility.statusColor}`}>
              {facility.status === "compliant"
                ? "Compliant"
                : facility.status === "at-risk"
                  ? "At Risk"
                  : "Missing Docs"}
            </span>
          </p>

          {/* State Facility Licenses */}
          <div className="mb-6 rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">State Facility Licenses</h3>
            {facility.licenses.map((license, index) => {
              const status = getLicenseStatus(license.expiresAt)

              return (
                <div key={index} className="space-y-2 mb-6 last:mb-0">
                  <p className="font-medium text-foreground">{license.name}</p>
                  <p className="text-sm text-foreground">
                    Status: <span className={`font-medium ${status.color}`}>{status.label}</span>
                  </p>
                  <p className="text-sm text-foreground">Expires: {new Date(license.expiresAt).toLocaleDateString()}</p>
                  <div className="mt-3 flex gap-3">
                    <button className="text-sm font-medium text-primary hover:underline">View License</button>
                    <button className="text-sm font-medium text-primary hover:underline">Renew</button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Safety & Inspections */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Safety & Inspections</h3>
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Fire Safety Inspection: <span className="font-medium text-green-600">Current (expires 12/31/2026)</span>
              </p>
              <p className="text-sm text-foreground">
                Health Department Inspection:{" "}
                <span className="font-medium text-green-600">Current (expires 06/30/2026)</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
