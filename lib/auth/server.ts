import { cookies } from "next/headers"

/**
 * Server-side helper to get the current organization ID from cookies
 * Used in API routes and server components
 */
export async function getOrgIdServer(): Promise<string | null> {
  const cookieStore = await cookies()
  const orgId = cookieStore.get("org_id")

  if (!orgId || !orgId.value) {
    return null
  }

  return orgId.value
}

/**
 * Server-side helper to validate both session and org_id cookies exist
 * Returns true if both are valid, false otherwise
 */
export async function validateSessionServer(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get("pilot_session")
  const orgId = cookieStore.get("org_id")

  return !!(session?.value && orgId?.value)
}
