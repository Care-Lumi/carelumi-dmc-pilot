"use client"

import type React from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string
          mode?: string
        },
        HTMLElement
      >
    }
  }
}

export function ElevenLabsWidget() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

  if (!agentId) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 p-4">
        ElevenLabs agent not found. Check NEXT_PUBLIC_ELEVENLABS_AGENT_ID.
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <elevenlabs-convai
        agent-id={agentId}
        mode="embedded"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          borderRadius: "12px",
        }}
      />
    </div>
  )
}
