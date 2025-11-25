// Organization configuration for multi-tenant CareLumi pilot
export type OrganizationType = "surgery_center" | "pediatric_therapy" | "behavioral_health"
export type TierType = "free" | "pro"

export interface Organization {
  id: string
  shortName: string
  fullName: string
  type: OrganizationType
  tier: TierType
  accessCode: string
  primaryContact: {
    name: string
    email: string
  }
  // Pro tier features - only Kemit Academy has these enabled
  useRealData: {
    facilities: boolean
    revenueRisk: boolean
    auditReadiness: boolean
  }
}

export const ORGANIZATIONS: Record<string, Organization> = {
  "dmc-inc": {
    id: "dmc-inc",
    shortName: "DMC Inc",
    fullName: "DMC Inc Surgery Centers",
    type: "surgery_center",
    tier: "free",
    accessCode: "JC_Alpha",
    primaryContact: {
      name: "John Cavanagh",
      email: "jcavanagh@dmc-inc.com",
    },
    useRealData: {
      facilities: false,
      revenueRisk: false,
      auditReadiness: false,
    },
  },
  "kemit-academy": {
    id: "kemit-academy",
    shortName: "Kemit Academy",
    fullName: "Kemit Academy Pediatric Therapy",
    type: "pediatric_therapy",
    tier: "pro",
    accessCode: "KR_Alpha",
    primaryContact: {
      name: "Kiley Russell",
      email: "kiley@kemitacademy.com",
    },
    useRealData: {
      facilities: true,
      revenueRisk: true,
      auditReadiness: true,
    },
  },
  "anda-therapy": {
    id: "anda-therapy",
    shortName: "Anda Therapy Group",
    fullName: "Anda Therapy Group",
    type: "behavioral_health",
    tier: "free",
    accessCode: "MB_Alpha",
    primaryContact: {
      name: "Martin Beck",
      email: "info@andatherapygroup.com",
    },
    useRealData: {
      facilities: false,
      revenueRisk: false,
      auditReadiness: false,
    },
  },
}

// Helper to get org by access code
export function getOrgByAccessCode(accessCode: string): Organization | null {
  return Object.values(ORGANIZATIONS).find((org) => org.accessCode === accessCode) || null
}

// Helper to get org by ID
export function getOrgById(orgId: string): Organization | null {
  return ORGANIZATIONS[orgId] || null
}
