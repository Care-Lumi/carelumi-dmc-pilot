import { type NextRequest, NextResponse } from "next/server"
import { getOrgById } from "@/lib/organizations"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const orgId = cookieStore.get("org_id")?.value

  console.log("[v0] current-org API called, org_id cookie:", orgId)

  if (!orgId) {
    console.log("[v0] No org_id cookie found")
    return NextResponse.json({ org: null }, { status: 200 })
  }

  const org = getOrgById(orgId)

  console.log("[v0] Found org:", org ? org.shortName : "null")

  if (!org) {
    console.log("[v0] org not found in ORGANIZATIONS")
    return NextResponse.json({ org: null }, { status: 200 })
  }

  // Return safe org data (no access code)
  return NextResponse.json({
    org: {
      id: org.id,
      shortName: org.shortName,
      fullName: org.fullName,
      type: org.type,
      tier: org.tier,
      primaryContact: org.primaryContact,
      useRealData: org.useRealData,
    },
  })
}
