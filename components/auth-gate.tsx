"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/pilot-login") {
      setIsAuthorized(true)
      setIsChecking(false)
      return
    }

    // Check if user has valid session in localStorage
    const sessionToken = localStorage.getItem("pilot_session")
    const sessionExpiry = localStorage.getItem("pilot_session_expiry")

    if (sessionToken && sessionExpiry) {
      const now = Date.now()
      const expiry = Number.parseInt(sessionExpiry, 10)

      if (now < expiry && sessionToken === "authorized") {
        // Valid session
        setIsAuthorized(true)
        setIsChecking(false)
        return
      }
    }

    // No valid session - redirect to login
    console.log("[v0] No valid session found, redirecting to login")
    router.replace("/pilot-login")
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-white to-[#FAFAFA]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#C19A82] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
