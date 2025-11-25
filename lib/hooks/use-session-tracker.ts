"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { v4 as uuidv4 } from "uuid"

/**
 * Session Tracker Hook
 * - Manages session lifecycle (start, heartbeat, end)
 * - Tracks page views automatically on route changes
 * - Sends heartbeat every 60 seconds (only if tab is visible)
 * - Ends session on logout or browser close (beforeunload)
 */
export function useSessionTracker() {
  const pathname = usePathname()
  const sessionIdRef = useRef<string | null>(null)
  const pageViewCountRef = useRef(0)
  const clickCountRef = useRef(0)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const previousPathRef = useRef<string>("")

  // Initialize session on mount
  useEffect(() => {
    initializeSession()

    // Cleanup on unmount
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
    }
  }, [])

  // Track page views on route change
  useEffect(() => {
    // Skip if this is the first render or same page
    if (!previousPathRef.current || previousPathRef.current === pathname) {
      previousPathRef.current = pathname
      return
    }

    trackPageView(pathname)
    previousPathRef.current = pathname
  }, [pathname])

  async function initializeSession() {
    // Check if session already exists in cookie
    let sessionId = Cookies.get("session_id")

    if (!sessionId) {
      // Create new session
      sessionId = uuidv4()
      Cookies.set("session_id", sessionId, { expires: 7 }) // 7 days, same as pilot_session

      // Start session in database
      try {
        await fetch("/api/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start_session",
            session_id: sessionId,
          }),
        })
        console.log("[CareLumi] Session started:", sessionId)
      } catch (error) {
        console.error("[CareLumi] Failed to start session:", error)
      }
    }

    sessionIdRef.current = sessionId

    // Start heartbeat (every 60 seconds)
    startHeartbeat()

    // End session on browser close or logout
    window.addEventListener("beforeunload", handleBeforeUnload)
  }

  function startHeartbeat() {
    // Clear any existing interval
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    // Send heartbeat every 60 seconds (only if tab is visible)
    heartbeatIntervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible" && sessionIdRef.current) {
        sendHeartbeat()
      }
    }, 60000) // 60 seconds
  }

  async function sendHeartbeat() {
    if (!sessionIdRef.current) return

    try {
      await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "heartbeat",
          session_id: sessionIdRef.current,
          page_views: pageViewCountRef.current,
          clicks: clickCountRef.current,
        }),
      })
    } catch (error) {
      console.error("[CareLumi] Heartbeat failed:", error)
    }
  }

  async function trackPageView(pagePath: string) {
    if (!sessionIdRef.current) return

    pageViewCountRef.current += 1

    try {
      await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "page_view",
          session_id: sessionIdRef.current,
          page_path: pagePath,
          referrer: document.referrer || null,
        }),
      })
    } catch (error) {
      console.error("[CareLumi] Page view tracking failed:", error)
    }
  }

  function handleBeforeUnload() {
    // Use sendBeacon for reliable delivery during page unload
    if (sessionIdRef.current) {
      const data = JSON.stringify({
        action: "end_session",
        session_id: sessionIdRef.current,
        page_views: pageViewCountRef.current,
        clicks: clickCountRef.current,
      })

      navigator.sendBeacon("/api/tracking", data)
    }
  }

  // Public method to end session (e.g., on explicit logout)
  function endSession() {
    if (sessionIdRef.current) {
      fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end_session",
          session_id: sessionIdRef.current,
          page_views: pageViewCountRef.current,
          clicks: clickCountRef.current,
        }),
      }).catch((error) => console.error("[CareLumi] Failed to end session:", error))

      // Clear session cookie
      Cookies.remove("session_id")
      sessionIdRef.current = null
    }
  }

  // Public method to increment click count
  function incrementClickCount() {
    clickCountRef.current += 1
  }

  return {
    sessionId: sessionIdRef.current,
    endSession,
    incrementClickCount,
  }
}
