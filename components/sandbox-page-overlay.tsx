"use client"

import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"

interface SandboxPageOverlayProps {
  pageKey: string
  title: string
  description: string
  featureName: string
}

export function SandboxPageOverlay({ pageKey, title, description, featureName }: SandboxPageOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    // Check sessionStorage to see if user has dismissed this overlay
    const dismissed = sessionStorage.getItem(`sandbox-dismissed-${pageKey}`)
    if (!dismissed) {
      setIsVisible(true)
    } else {
      setShowBadge(true)
    }
  }, [pageKey])

  const handlePlayWithSandbox = () => {
    sessionStorage.setItem(`sandbox-dismissed-${pageKey}`, "true")
    setIsVisible(false)
    setShowBadge(true)
  }

  const handleUpgrade = () => {
    // In production, this would open upgrade flow
    alert("Contact sales to upgrade and unlock live data for this feature.")
  }

  if (!isVisible && !showBadge) return null

  return (
    <>
      {/* Full-page overlay */}
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <h2 className="mb-3 text-center text-2xl font-semibold text-foreground">{title}</h2>

            <div className="mb-6 text-center text-sm text-muted-foreground space-y-3">
              <p className="leading-relaxed">{description}</p>

              <div className="text-left max-w-md mx-auto space-y-2">
                <p className="font-medium">What you can do:</p>
                <ul className="space-y-1.5 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Explore with example data below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Ask Clip questions about this feature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Upgrade to unlock your live data</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayWithSandbox}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Play with Sandbox Data
              </button>

              <button
                onClick={handleUpgrade}
                className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Upgrade to Unlock Live {featureName} Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent badge at top of page */}
      {showBadge && (
        <div className="sticky top-16 z-40 border-b border-amber-200 bg-amber-50 px-6 py-3 text-center">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Sandbox mode</span> · You're viewing example data only. Your real documents
            are in Documents & Reports.{" "}
            <button onClick={handleUpgrade} className="underline hover:text-amber-700">
              Upgrade to unlock live data
            </button>
          </p>
        </div>
      )}
    </>
  )
}
