import { type NextRequest, NextResponse } from "next/server"

const getSessionSecret = () => {
  return process.env.PILOT_SESSION_SECRET || "carelumi-pilot-session-secret"
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Check password against environment variable
    const validPassword = process.env.PILOT_PASSWORD

    if (!validPassword) {
      console.error("[CareLumi] PILOT_PASSWORD environment variable not set")
      return NextResponse.json({ error: "Authentication not configured" }, { status: 500 })
    }

    if (password === validPassword) {
      // Create response with session cookie
      const response = NextResponse.json({ success: true })

      const sessionSecret = getSessionSecret()
      console.log("[v0] Setting session cookie with secret")

      response.cookies.set("pilot_session", sessionSecret, {
        httpOnly: true,
        secure: true, // Must be true for sameSite: "none"
        sameSite: "none", // Required for cross-origin in Vercel preview
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    }

    // Invalid password
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("[CareLumi] Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
