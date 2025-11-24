"use client"

import { useEffect, useRef, useState } from "react"
import { Orb } from "@/components/ui/orb"
import { ElevenLabsWidget } from "@/components/elevenlabs-widget"

interface ClipChatModalProps {
  isOpen: boolean
  onClose: () => void
  initialContext?: string
}

export function ClipChatModal({ isOpen, onClose, initialContext }: ClipChatModalProps) {
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [response, setResponse] = useState("")
  const [agentId, setAgentId] = useState<string>("")
  const [isListening, setIsListening] = useState(false)
  const widgetContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/elevenlabs-config")
      .then((res) => res.json())
      .then((data) => setAgentId(data.agentId))
      .catch((err) => console.error("Failed to load ElevenLabs config:", err))
  }, [])

  useEffect(() => {
    if (!isOpen || !agentId || typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://elevenlabs.io/convai-widget/index.js"
    script.async = true

    script.onload = () => {
      if (window.ConvaiWidget && widgetContainerRef.current) {
        window.ConvaiWidget.init({
          agentId: agentId,
          mode: "inline",
          primaryColor: "#3b82f6",
          defaultOpen: false,
          onReady: () => {
            console.log("[v0] Clip voice agent ready")
          },
          onError: (error: Error) => {
            console.error("[v0] ElevenLabs widget error:", error)
          },
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (window.ConvaiWidget?.destroy) {
        window.ConvaiWidget.destroy()
      }
    }
  }, [isOpen, agentId])

  if (!isOpen) return null

  const suggestedPrompts = [
    "What should I upload first for our Texas surgery centers?",
    "Explain what the trial version of CareLumi can and cannot do.",
    "How will CareLumi handle expiring licenses once we upgrade?",
  ]

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className="fixed right-6 top-6 bottom-6 z-50 w-full max-w-2xl rounded-lg border border-border bg-card shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <Orb colors={["#F6E7D8", "#E0CFC2"]} agentState={null} className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Ask Clip</h2>
              <p className="text-xs text-muted-foreground">AI Compliance Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Trial Banner */}
          <div className="p-6 pb-0 flex-shrink-0">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              This is a trial preview of Clip. Answers are high-level and are not connected to your live data during the
              free trial.
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="px-6 pt-4 pb-4 flex-shrink-0">
            <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* ElevenLabs Widget Container */}
          <div className="flex-1 px-6 pb-6 min-h-[450px]">
            <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-white">
              <ElevenLabsWidget />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
