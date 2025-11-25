"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface OnboardingWelcomeProps {
  isOpen: boolean
  onTakeTour: () => void
  onSkip: () => void
}

export function OnboardingWelcome({ isOpen, onTakeTour, onSkip }: OnboardingWelcomeProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleTakeTour = () => {
    localStorage.setItem("carelumi_dmc_onboarding_seen", "true")
    onTakeTour()
  }

  const handleSkip = () => {
    localStorage.setItem("carelumi_dmc_onboarding_seen", "true")
    onSkip()
  }

  const trialCapabilities = [
    "Upload & classify real documents with AI",
    "Track staff licenses & expiration alerts",
    "See sandbox examples of full features",
    "Chat with Clip for guidance",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to CareLumi, John</DialogTitle>
          <DialogDescription className="text-base text-foreground/80 pt-2">
            You're in the free trial. Here's what you can do right now:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {trialCapabilities.map((capability, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/90">{capability}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Want a quick tour of where everything is? It takes less than a minute.
        </p>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSkip} variant="outline" className="flex-1 bg-transparent">
            Skip, let me explore
          </Button>
          <Button onClick={handleTakeTour} className="flex-1">
            Take Quick Tour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
