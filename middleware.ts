import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getOrgById } from "@/lib/organizations"

const getSessionSecret = () => {
  return process.env.PILOT_SESSION_SECRET || "carelumi-pilot-session-secret"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow pilot login page
  if (pathname === "/pilot-login") {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get("pilot_session")
  const orgIdCookie = request.cookies.get("org_id")

  // Check if both cookies exist
  if (!sessionCookie?.value || !orgIdCookie?.value) {
    console.log("[v0] Missing cookies, redirecting to login")
    return NextResponse.redirect(new URL("/pilot-login", request.url))
  }

  // Validate session secret
  const sessionSecret = getSessionSecret()
  if (sessionCookie.value !== sessionSecret) {
    console.log("[v0] Invalid session, redirecting to login")
    const response = NextResponse.redirect(new URL("/pilot-login", request.url))
    response.cookies.delete("pilot_session")
    response.cookies.delete("org_id")
    return response
  }

  // Validate org_id is a valid organization
  const org = getOrgById(orgIdCookie.value)
  if (!org) {
    console.log(`[v0] Invalid org_id: ${orgIdCookie.value}, redirecting to login`)
    const response = NextResponse.redirect(new URL("/pilot-login", request.url))
    response.cookies.delete("pilot_session")
    response.cookies.delete("org_id")
    return response
  }

  // Both cookies valid - allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)",
  ],
}
