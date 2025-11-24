"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UpgradeOverlayContextType = {
  showOverlay: (feature: string) => void
  dismissedFeatures: Set<string>
}

const UpgradeOverlayContext = createContext<UpgradeOverlayContextType | undefined>(undefined)

export function UpgradeOverlayProvider({ children }: { children: ReactNode }) {
  const [dismissedFeatures, setDismissedFeatures] = useState<Set<string>>(new Set())

  const showOverlay = (feature: string) => {
    setDismissedFeatures((prev) => new Set([...prev, feature]))
  }

  return (
    <UpgradeOverlayContext.Provider value={{ showOverlay, dismissedFeatures }}>
      {children}
    </UpgradeOverlayContext.Provider>
  )
}

export function useUpgradeOverlay() {
  const context = useContext(UpgradeOverlayContext)
  if (!context) {
    throw new Error("useUpgradeOverlay must be used within UpgradeOverlayProvider")
  }
  return context
}
