"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Organization, getOrgById } from "@/lib/organizations"

interface OrgContextType {
  org: Organization | null
  isLoading: boolean
}

const OrgContext = createContext<OrgContextType>({
  org: null,
  isLoading: true,
})

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [org, setOrg] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Read org_id from cookies (client-side)
    const cookies = document.cookie.split("; ")
    const orgIdCookie = cookies.find((c) => c.startsWith("org_id="))

    if (orgIdCookie) {
      const orgId = orgIdCookie.split("=")[1]
      const organization = getOrgById(orgId)
      setOrg(organization)
    }

    setIsLoading(false)
  }, [])

  return <OrgContext.Provider value={{ org, isLoading }}>{children}</OrgContext.Provider>
}

/**
 * Hook to access current organization context
 * Returns the organization object or null if not logged in
 */
export function useOrg() {
  const context = useContext(OrgContext)
  if (context === undefined) {
    throw new Error("useOrg must be used within an OrgProvider")
  }
  return context
}
