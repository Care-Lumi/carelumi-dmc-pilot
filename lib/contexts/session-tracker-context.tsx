"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSessionTracker } from "@/lib/hooks/use-session-tracker"

const SessionContext = createContext<ReturnType<typeof useSessionTracker> | null>(null)

export function SessionTrackerProvider({ children }: { children: ReactNode }) {
  const sessionTracker = useSessionTracker()

  return <SessionContext.Provider value={sessionTracker}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within SessionTrackerProvider")
  }
  return context
}
