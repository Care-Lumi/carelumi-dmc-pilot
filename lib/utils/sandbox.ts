import type { Organization } from "@/lib/organizations"

/**
 * Determines whether to show real data vs. sandbox data for a specific feature
 * Only Kemit Academy (Pro tier) has real data enabled for certain features
 *
 * @param org - Current organization
 * @param feature - Feature to check ('facilities' | 'revenueRisk' | 'auditReadiness')
 * @returns true if real data should be shown, false for sandbox data
 */
export function shouldShowRealData(
  org: Organization | null,
  feature: "facilities" | "revenueRisk" | "auditReadiness",
): boolean {
  if (!org) return false
  return org.useRealData[feature]
}
