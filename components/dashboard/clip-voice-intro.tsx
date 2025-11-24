"use client"

import { useEffect, useState } from "react"
import { Orb } from "@/components/ui/orb"

interface ClipVoiceIntroProps {
  isOpen: boolean
  onComplete: () => void
  onSkip: () => void
}

export function ClipVoiceIntro({ isOpen, onComplete, onSkip }: ClipVoiceIntroProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)

  const sentences = [
    "Welcome, Jack!",
    "I am Clip, CareLumi's AI compliance assistant.",
    "During this trial you can type or ask questions about compliance, document uploads, and how CareLumi works.",
  ]

  useEffect(() => {
    if (!isOpen) return

    // Show each sentence with 1.5 second delay
    const timer = setTimeout(() => {
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1)
      }
    }, 1500)

    localStorage.setItem("carelumi_has_met_clip", "true")

    return () => clearTimeout(timer)
  }, [isOpen, currentSentenceIndex])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center">
              <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState="talking" className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Meet Clip</h2>
              <p className="text-xs text-muted-foreground">Your AI Compliance Assistant</p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip introduction"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8 min-h-[400px]">
          <div className="flex items-center justify-center">
            <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState="talking" className="h-32 w-32" />
          </div>

          <div className="text-center max-w-md space-y-4">
            {sentences.slice(0, currentSentenceIndex + 1).map((sentence, index) => (
              <p key={index} className="text-lg text-foreground leading-relaxed animate-in fade-in duration-500">
                {sentence}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 space-y-3">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Tip:</strong> You can type questions to Clip about compliance and CareLumi features
          </p>
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={onComplete}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Continue tour
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
