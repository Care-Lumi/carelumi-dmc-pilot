import { NextResponse } from "next/server"

export async function GET() {
  // Only return the agent ID to the client
  // The API key stays on the server
  return NextResponse.json({
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
    // API key is handled server-side only
  })
}
