"use client"

import Cookies from "js-cookie"
import { usePathname } from "next/navigation"

/**
 * Click Tracker Hook
 * Tracks specific button clicks defined in Phase 2
 */
export function useClickTracker() {
  const pathname = usePathname()

  async function trackClick(eventName: string, metadata?: Record<string, any>) {
    const sessionId = Cookies.get("session_id")
    if (!sessionId) {
      console.warn("[CareLumi] No session_id found, skipping click tracking")
      return
    }

    try {
      await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "click_event",
          session_id: sessionId,
          event_name: eventName,
          page_path: pathname,
          metadata: metadata || null,
        }),
      })
    } catch (error) {
      console.error("[CareLumi] Click tracking failed:", error)
    }
  }

  return { trackClick }
}
