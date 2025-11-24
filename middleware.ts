import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const getSessionSecret = () => {
  return process.env.PILOT_SESSION_SECRET || "carelumi-pilot-session-secret"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all routes - authentication is now handled by client-side AuthGate component
  // This avoids cookie persistence issues in Vercel preview deployments
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
