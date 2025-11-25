import { type NextRequest, NextResponse } from "next/server"
import { getOrgByAccessCode } from "@/lib/organizations"
import { sql } from "@/lib/db"

const getSessionSecret = () => {
  return process.env.PILOT_SESSION_SECRET || "carelumi-pilot-session-secret"
}

export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json()

    if (!accessCode) {
      return NextResponse.json({ error: "Access code required" }, { status: 400 })
    }

    const org = getOrgByAccessCode(accessCode)

    if (!org) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 401 })
    }

    console.log(`[v0] Access code matched for org: ${org.id}`)

    try {
      await sql`
        INSERT INTO organizations (id, name, primary_contact_name, primary_contact_email)
        VALUES (${org.id}, ${org.fullName}, ${org.primaryContact.name}, ${org.primaryContact.email})
        ON CONFLICT (id) DO NOTHING
      `
      console.log(`[v0] Organization ${org.id} seeded in database`)
    } catch (dbError) {
      console.error("[v0] Database seed error:", dbError)
      // Continue even if database seed fails - not critical for auth
    }

    const response = NextResponse.json({
      success: true,
      orgId: org.id,
      orgName: org.shortName,
    })

    const sessionSecret = getSessionSecret()
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    }

    response.cookies.set("pilot_session", sessionSecret, cookieOptions)
    response.cookies.set("org_id", org.id, cookieOptions)

    console.log(`[v0] Set cookies: pilot_session and org_id=${org.id}`)

    return response
  } catch (error) {
    console.error("[CareLumi] Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
