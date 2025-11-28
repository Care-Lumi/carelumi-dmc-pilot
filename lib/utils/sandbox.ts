import type { Organization } from "@/lib/organizations"
import {
  SANDBOX_PAYERS as SURGERY_PAYERS,
  SANDBOX_FACILITIES as SURGERY_FACILITIES,
  SANDBOX_AUDIT_MISSING as SURGERY_AUDIT_MISSING,
  SANDBOX_AUDIT_COMPLETE_ITEMS as SURGERY_AUDIT_COMPLETE,
  SANDBOX_BILLING_COMPLIANCE as SURGERY_BILLING,
  SANDBOX_REGULATORY_UPDATES as SURGERY_REGULATORY,
  SANDBOX_DOCUMENTS as SURGERY_DOCUMENTS,
} from "@/lib/data/sandbox-surgery-center"
import {
  SANDBOX_PAYERS as BEHAVIORAL_PAYERS,
  SANDBOX_FACILITIES as BEHAVIORAL_FACILITIES,
  SANDBOX_AUDIT_MISSING as BEHAVIORAL_AUDIT_MISSING,
  SANDBOX_AUDIT_COMPLETE_ITEMS as BEHAVIORAL_AUDIT_COMPLETE,
  SANDBOX_BILLING_COMPLIANCE as BEHAVIORAL_BILLING,
  SANDBOX_REGULATORY_UPDATES as BEHAVIORAL_REGULATORY,
  SANDBOX_DOCUMENTS as BEHAVIORAL_DOCUMENTS,
} from "@/lib/data/sandbox-behavioral-health"
import {
  SANDBOX_PAYERS as PEDIATRIC_PAYERS,
  SANDBOX_FACILITIES as PEDIATRIC_FACILITIES,
  SANDBOX_AUDIT_MISSING as PEDIATRIC_AUDIT_MISSING,
  SANDBOX_AUDIT_COMPLETE_ITEMS as PEDIATRIC_AUDIT_COMPLETE,
  SANDBOX_BILLING_COMPLIANCE as PEDIATRIC_BILLING,
  SANDBOX_REGULATORY_UPDATES as PEDIATRIC_REGULATORY,
  SANDBOX_DOCUMENTS as PEDIATRIC_DOCUMENTS,
} from "@/lib/data/sandbox-pediatric-therapy"

/**
 * Get org-specific sandbox data based on organization type
 * @param orgType - Organization type from organizations.ts
 * @returns Object containing all sandbox data arrays for that org
 */
export function getSandboxDataForOrg(orgType = "surgery_center") {
  switch (orgType) {
    case "behavioral_health":
      return {
        SANDBOX_PAYERS: BEHAVIORAL_PAYERS,
        SANDBOX_FACILITIES: BEHAVIORAL_FACILITIES,
        SANDBOX_AUDIT_MISSING: BEHAVIORAL_AUDIT_MISSING,
        SANDBOX_AUDIT_COMPLETE_ITEMS: BEHAVIORAL_AUDIT_COMPLETE,
        SANDBOX_BILLING_COMPLIANCE: BEHAVIORAL_BILLING,
        SANDBOX_REGULATORY_UPDATES: BEHAVIORAL_REGULATORY,
        SANDBOX_DOCUMENTS: BEHAVIORAL_DOCUMENTS,
      }
    case "pediatric_therapy":
      return {
        SANDBOX_PAYERS: PEDIATRIC_PAYERS,
        SANDBOX_FACILITIES: PEDIATRIC_FACILITIES,
        SANDBOX_AUDIT_MISSING: PEDIATRIC_AUDIT_MISSING,
        SANDBOX_AUDIT_COMPLETE_ITEMS: PEDIATRIC_AUDIT_COMPLETE,
        SANDBOX_BILLING_COMPLIANCE: PEDIATRIC_BILLING,
        SANDBOX_REGULATORY_UPDATES: PEDIATRIC_REGULATORY,
        SANDBOX_DOCUMENTS: PEDIATRIC_DOCUMENTS,
      }
    case "surgery_center":
    default:
      return {
        SANDBOX_PAYERS: SURGERY_PAYERS,
        SANDBOX_FACILITIES: SURGERY_FACILITIES,
        SANDBOX_AUDIT_MISSING: SURGERY_AUDIT_MISSING,
        SANDBOX_AUDIT_COMPLETE_ITEMS: SURGERY_AUDIT_COMPLETE,
        SANDBOX_BILLING_COMPLIANCE: SURGERY_BILLING,
        SANDBOX_REGULATORY_UPDATES: SURGERY_REGULATORY,
        SANDBOX_DOCUMENTS: SURGERY_DOCUMENTS,
      }
  }
}

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
