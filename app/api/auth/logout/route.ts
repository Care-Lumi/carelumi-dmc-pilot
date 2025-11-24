import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear session cookie
  response.cookies.delete("pilot_session")

  return response
}
