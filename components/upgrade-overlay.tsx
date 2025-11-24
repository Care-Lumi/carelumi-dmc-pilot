"use client"

import { useState } from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUpgradeOverlay } from "@/lib/contexts/upgrade-overlay-context"

interface UpgradeOverlayProps {
  feature: string
  title?: string
  description?: string
}

export function UpgradeOverlay({
  feature,
  title = "Contact Sales to Upgrade",
  description = "This feature is available in our premium plan. Contact our sales team to learn more about upgrading your account.",
}: UpgradeOverlayProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { showOverlay, dismissedFeatures } = useUpgradeOverlay()

  // Don't show if already dismissed
  if (dismissedFeatures.has(feature) || !isVisible) {
    return null
  }

  const handleDismiss = () => {
    showOverlay(feature)
    setIsVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-md p-8 shadow-xl">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3b82f6]/10">
            <Sparkles className="h-8 w-8 text-[#3b82f6]" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Actions */}
          <div className="flex gap-3 pt-4 w-full">
            <Button onClick={handleDismiss} variant="outline" className="flex-1 bg-transparent">
              Got it
            </Button>
            <Button
              onClick={() => {
                window.open("mailto:hello@carelumi.com?subject=Upgrade Inquiry", "_blank")
                handleDismiss()
              }}
              className="flex-1 bg-[#3b82f6] hover:bg-[#3b82f6]/90"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
