"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Organization } from "@/lib/organizations"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  const isLoginPage = pathname === "/pilot-login"

  useEffect(() => {
    if (isLoginPage) {
      console.log("[v0] On login page, skipping org fetch")
      setIsLoading(false)
      return
    }

    async function fetchCurrentOrg() {
      try {
        console.log("[v0] Fetching current org from API...")
        const response = await fetch("/api/auth/current-org")
        const data = await response.json()

        console.log("[v0] API response:", data)

        if (data.org) {
          console.log("[v0] Setting org:", data.org.shortName)
          setOrg(data.org)
        } else {
          console.log("[v0] No org returned from API")
        }
      } catch (error) {
        console.error("[v0] Failed to fetch current org:", error)
      } finally {
        console.log("[v0] Setting isLoading to false")
        setIsLoading(false)
      }
    }

    fetchCurrentOrg()
  }, [isLoginPage, pathname])

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
