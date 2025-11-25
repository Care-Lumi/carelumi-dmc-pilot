import { type NextRequest, NextResponse } from "next/server"
import { getOrgById } from "@/lib/organizations"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const orgId = cookieStore.get("org_id")?.value

  if (!orgId) {
    return NextResponse.json({ org: null }, { status: 200 })
  }

  const org = getOrgById(orgId)

  if (!org) {
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
