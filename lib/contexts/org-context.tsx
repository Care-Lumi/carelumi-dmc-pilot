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
      setIsLoading(false)
      return
    }

    async function fetchCurrentOrg() {
      try {
        const response = await fetch("/api/auth/current-org")
        const data = await response.json()

        if (data.org) {
          setOrg(data.org)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch current org:", error)
      } finally {
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
