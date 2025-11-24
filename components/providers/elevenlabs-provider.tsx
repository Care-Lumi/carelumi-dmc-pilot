"use client"

import { useEffect } from "react"

export function ElevenLabsProvider() {
  useEffect(() => {
    // Prevent duplicate loads
    if (document.getElementById("elevenlabs-script")) return

    const script = document.createElement("script")
    script.id = "elevenlabs-script"
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed"
    script.async = true
    script.type = "text/javascript"

    script.onload = () => {
      console.log("[v0] ElevenLabs widget script loaded globally")
    }

    script.onerror = () => {
      console.error("[v0] Failed to load ElevenLabs widget script")
    }

    document.body.appendChild(script)
  }, [])

  return null
}
