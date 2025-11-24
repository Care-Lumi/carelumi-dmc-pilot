"use client"

import { useEffect, useRef, useState } from "react"

interface ElevenLabsWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function ElevenLabsWidget({ isOpen, onClose }: ElevenLabsWidgetProps) {
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const [agentId, setAgentId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    console.log("[v0] Fetching ElevenLabs config...")
    fetch("/api/elevenlabs-config")
      .then((res) => res.json())
      .then((data) => {
        console.log("[v0] ElevenLabs agent ID:", data.agentId)
        setAgentId(data.agentId)
      })
      .catch((err) => {
        console.error("[v0] Failed to load ElevenLabs config:", err)
        setError("Failed to load voice assistant configuration")
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isOpen || !agentId || typeof window === "undefined") {
      console.log("[v0] Widget init skipped:", { isOpen, agentId, window: typeof window })
      return
    }

    const isV0Dev = window.location.hostname.includes("v0.app") || window.location.hostname.includes("v0-preview")

    if (isV0Dev) {
      console.log("[v0] Running in v0 development - ElevenLabs widget requires production deployment")
      setError("Voice assistant requires production deployment to function. Deploy to Vercel to test voice features.")
      setIsLoading(false)
      return
    }

    console.log("[v0] Loading ElevenLabs widget script...")
    setIsLoading(true)

    const script = document.createElement("script")
    script.src = "https://elevenlabs.io/convai-widget/index.js"
    script.async = true

    script.onload = () => {
      console.log("[v0] ElevenLabs script loaded")

      setTimeout(() => {
        if (window.ConvaiWidget && widgetContainerRef.current) {
          console.log("[v0] Initializing ConvaiWidget...")
          try {
            window.ConvaiWidget.init({
              agentId: agentId,
              mode: "inline",
              primaryColor: "#E0CFC2",
              defaultOpen: true,
              onReady: () => {
                console.log("[v0] Clip voice agent ready!")
                setIsLoading(false)
              },
              onError: (error: Error) => {
                console.error("[v0] ElevenLabs widget error:", error)
                setError("Voice assistant failed to load")
                setIsLoading(false)
              },
            })
          } catch (err) {
            console.error("[v0] Failed to initialize widget:", err)
            setError("Failed to initialize voice assistant")
            setIsLoading(false)
          }
        } else {
          console.error("[v0] ConvaiWidget not available or container missing")
          setError("Voice assistant not available")
          setIsLoading(false)
        }
      }, 500) // Wait 500ms for widget to be available
    }

    script.onerror = () => {
      console.error("[v0] Failed to load ElevenLabs script")
      setError("Failed to load voice assistant script")
      setIsLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      console.log("[v0] Cleaning up ElevenLabs widget...")
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (window.ConvaiWidget?.destroy) {
        window.ConvaiWidget.destroy()
      }
    }
  }, [isOpen, agentId])

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full w-full">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading voice assistant...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md space-y-4">
            <div className="text-6xl">🎤</div>
            <h3 className="text-lg font-semibold">Voice Assistant Unavailable</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
              <strong>Development Note:</strong> The ElevenLabs voice widget requires deployment to a production
              environment with proper domain configuration. Push your changes to Vercel to test the full voice
              conversation experience.
            </div>
          </div>
        </div>
      )}

      <div
        ref={widgetContainerRef}
        className="flex-1 w-full h-full overflow-hidden rounded-lg bg-background"
        id="elevenlabs-widget-container"
      >
        {/* ElevenLabs widget will be injected here */}
      </div>
    </div>
  )
}

declare global {
  interface Window {
    ConvaiWidget?: {
      init: (config: {
        agentId: string
        mode?: "inline" | "float"
        primaryColor?: string
        defaultOpen?: boolean
        onReady?: () => void
        onError?: (error: Error) => void
      }) => void
      destroy?: () => void
    }
  }
}
