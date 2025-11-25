import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getOrgIdServer } from "@/lib/auth/server"

export async function POST(request: NextRequest) {
  try {
    const orgId = await getOrgIdServer()
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, session_id, page_path, event_name, referrer, metadata, page_views, clicks } = body

    switch (action) {
      case "start_session": {
        // Create new session
        await sql`
          INSERT INTO sessions (id, org_id, started_at)
          VALUES (${session_id}, ${orgId}, NOW())
        `
        return NextResponse.json({ success: true })
      }

      case "heartbeat": {
        // Update session activity (called every 60 seconds)
        await sql`
          UPDATE sessions
          SET page_views = ${page_views},
              clicks = ${clicks}
          WHERE id = ${session_id}
        `
        return NextResponse.json({ success: true })
      }

      case "end_session": {
        // End session and calculate total duration
        await sql`
          UPDATE sessions
          SET ended_at = NOW(),
              total_duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
              page_views = ${page_views},
              clicks = ${clicks}
          WHERE id = ${session_id}
        `
        return NextResponse.json({ success: true })
      }

      case "page_view": {
        // Log page view
        await sql`
          INSERT INTO page_view_logs (session_id, org_id, page_path, viewed_at, referrer)
          VALUES (${session_id}, ${orgId}, ${page_path}, NOW(), ${referrer || null})
        `

        // Increment session page view count
        await sql`
          UPDATE sessions
          SET page_views = page_views + 1
          WHERE id = ${session_id}
        `

        return NextResponse.json({ success: true })
      }

      case "click_event": {
        // Log click event
        await sql`
          INSERT INTO click_event_logs (session_id, org_id, event_name, page_path, clicked_at, metadata)
          VALUES (${session_id}, ${orgId}, ${event_name}, ${page_path}, NOW(), ${metadata ? JSON.stringify(metadata) : null})
        `

        // Increment session click count
        await sql`
          UPDATE sessions
          SET clicks = clicks + 1
          WHERE id = ${session_id}
        `

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[CareLumi] Tracking API error:", error)
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 })
  }
}
