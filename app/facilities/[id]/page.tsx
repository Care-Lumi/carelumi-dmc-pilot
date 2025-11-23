"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { facilities } from "@/lib/placeholder-data"
import { ChevronLeft } from "lucide-react"

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  return <FacilityDetailContent params={params} />
}

function FacilityDetailContent({ params }: { params: { id: string } }) {
  const [facility, setFacility] = useState(() => facilities.find((f) => f.id === params.id))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!facility) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopNav />
        <main className="ml-60 mt-16 p-12">
          <p>Facility not found</p>
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
            <span className="font-medium text-green-600">
              {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
            </span>
          </p>

          {/* State Facility Licenses */}
          <div className="mb-6 rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">State Facility Licenses</h3>
            {facility.licenses.map((license) => (
              <div key={license.id} className="space-y-2">
                <p className="font-medium text-foreground">{license.type}</p>
                <p className="text-sm text-foreground">License #: {license.number}</p>
                <p className="text-sm text-foreground">
                  Status:{" "}
                  <span className="font-medium text-green-600">
                    {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                  </span>
                </p>
                <p className="text-sm text-foreground">Expires: {new Date(license.expiresAt).toLocaleDateString()}</p>
                <div className="mt-3 flex gap-3">
                  <button className="text-sm font-medium text-primary hover:underline">View License</button>
                  <button className="text-sm font-medium text-primary hover:underline">Renew</button>
                </div>
              </div>
            ))}
          </div>

          {/* Safety & Inspections */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Safety & Inspections</h3>
            <div className="space-y-2">
              {facility.inspections.map((inspection) => (
                <p key={inspection.id} className="text-sm text-foreground">
                  {inspection.type}:{" "}
                  {inspection.status === "current" ? (
                    <span className="font-medium text-green-600">
                      Current (expires {new Date(inspection.expiresAt).toLocaleDateString()})
                    </span>
                  ) : (
                    <span className="font-medium text-yellow-600">
                      Scheduled {new Date(inspection.scheduledDate!).toLocaleDateString()}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
