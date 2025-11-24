"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { tourSteps } from "@/lib/dashboard-tour"

interface TourOverlayProps {
  isActive: boolean
  onComplete: () => void
}

export function TourOverlay({ isActive, onComplete }: TourOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!isActive) return

    const updatePositions = () => {
      const step = tourSteps[currentStep]
      const element = document.querySelector(`[data-tour="${step.target}"]`)

      if (element) {
        const rect = element.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth

        setHighlightPosition({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        })

        let tooltipTop = 0
        let tooltipLeft = rect.left
        const tooltipWidth = 400
        const tooltipHeight = 250 // Approximate height

        // Determine best position based on available space
        switch (step.position) {
          case "bottom":
            // Check if there's enough space below
            if (rect.bottom + tooltipHeight + 30 < viewportHeight) {
              tooltipTop = rect.bottom + 20
            } else {
              // Not enough space below, position above
              tooltipTop = rect.top - tooltipHeight - 20
            }
            // Center horizontally relative to element
            tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2
            break

          case "top":
            tooltipTop = Math.max(20, rect.top - tooltipHeight - 20)
            tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2
            break

          case "left":
            tooltipTop = Math.max(20, rect.top - 50)
            tooltipLeft = Math.max(20, rect.left - tooltipWidth - 20)
            break

          case "right":
            tooltipTop = Math.max(20, rect.top - 50)
            tooltipLeft = Math.min(rect.right + 20, viewportWidth - tooltipWidth - 20)
            break
        }

        tooltipLeft = Math.max(20, Math.min(tooltipLeft, viewportWidth - tooltipWidth - 20))
        tooltipTop = Math.max(20, Math.min(tooltipTop, viewportHeight - tooltipHeight - 20))

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
      }
    }

    updatePositions()
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(updatePositions, 100)
    window.addEventListener("resize", updatePositions)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", updatePositions)
    }
  }, [currentStep, isActive])

  if (!isActive) return null

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem("carelumi_dmc_onboarding_seen", "true")
    onComplete()
  }

  const step = tourSteps[currentStep]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={handleComplete} />

      {/* Highlight box */}
      <div
        className="fixed z-[101] rounded-lg ring-4 ring-primary/50 bg-transparent pointer-events-none transition-all duration-300"
        style={{
          top: highlightPosition.top,
          left: highlightPosition.left,
          width: highlightPosition.width,
          height: highlightPosition.height,
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[102] w-[400px] bg-card border border-border rounded-lg shadow-xl p-6 transition-all duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep + 1} of {tourSteps.length}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleComplete} className="h-6 w-6 -mt-1">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed mb-6">{step.description}</p>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleComplete} className="text-sm">
            Skip Tour
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="text-sm bg-transparent">
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="text-sm">
              {currentStep < tourSteps.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
