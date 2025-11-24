export type RegulatoryProfile = {
  jurisdiction: string
  documentType: string
  renewalCycleDays: number
  ceRequiredHours: number | null
  renewalUrl: string | null
  requirements: string[]
}

export const REGULATORY_PROFILES: Record<string, RegulatoryProfile> = {
  // Texas Ambulatory Surgical Center (Facility)
  TX_AMBULATORY_SURGICAL_CENTER: {
    jurisdiction: "Texas",
    documentType: "Ambulatory Surgical Center",
    renewalCycleDays: 730, // 2 years
    ceRequiredHours: null,
    renewalUrl:
      "https://www.hhs.texas.gov/doing-business-hhs/provider-portal/health-facility-regulation/facility-licensing",
    requirements: [
      "Review renewal notice from Texas Health and Human Services Commission (HHSC), typically sent 60 days before expiration",
      "Complete and submit the required annual report listing reportable events per Health & Safety Code § 243.052",
      "Complete the ASC renewal application through the HHSC online portal",
      "Pay the required renewal fee (approximately $2,500 for 2-year term)",
      "Upload your renewal confirmation to CareLumi to update facility license to Active status",
    ],
  },
  TX_ASC_LICENSE: {
    jurisdiction: "Texas",
    documentType: "ASC License",
    renewalCycleDays: 730,
    ceRequiredHours: null,
    renewalUrl:
      "https://www.hhs.texas.gov/doing-business-hhs/provider-portal/health-facility-regulation/facility-licensing",
    requirements: [
      "Review renewal notice from Texas Health and Human Services Commission (HHSC), typically sent 60 days before expiration",
      "Complete and submit the required annual report listing reportable events per Health & Safety Code § 243.052",
      "Complete the ASC renewal application through the HHSC online portal",
      "Pay the required renewal fee (approximately $2,500 for 2-year term)",
      "Upload your renewal confirmation to CareLumi to update facility license to Active status",
    ],
  },

  // Texas Registered Nurse (Staff)
  TX_REGISTERED_NURSE: {
    jurisdiction: "Texas",
    documentType: "Registered Nurse",
    renewalCycleDays: 730, // 2 years
    ceRequiredHours: 20,
    renewalUrl: "https://www.bon.texas.gov/licensure_renewal.asp",
    requirements: [
      "Complete 20 contact hours of continuing nursing education (CNE) in your area of practice during the 2-year renewal period",
      "Ensure CNE includes mandatory topics: nursing jurisprudence & ethics (required every other cycle), human trafficking prevention, and geriatric care if working with older adults",
      "Log in to the Texas Board of Nursing online portal during your birth month renewal window",
      "Complete the renewal application and pay the $68 renewal fee",
      "Upload your renewal confirmation to CareLumi to update this license to Active status",
    ],
  },
  TX_RN_LICENSE: {
    jurisdiction: "Texas",
    documentType: "RN License",
    renewalCycleDays: 730,
    ceRequiredHours: 20,
    renewalUrl: "https://www.bon.texas.gov/licensure_renewal.asp",
    requirements: [
      "Complete 20 contact hours of continuing nursing education (CNE) in your area of practice during the 2-year renewal period",
      "Ensure CNE includes mandatory topics: nursing jurisprudence & ethics (required every other cycle), human trafficking prevention, and geriatric care if working with older adults",
      "Log in to the Texas Board of Nursing online portal during your birth month renewal window",
      "Complete the renewal application and pay the $68 renewal fee",
      "Upload your renewal confirmation to CareLumi to update this license to Active status",
    ],
  },

  // Illinois Occupational Therapy (Staff)
  IL_OCCUPATIONAL_THERAPY: {
    jurisdiction: "Illinois",
    documentType: "Occupational Therapy",
    renewalCycleDays: 730, // 2 years
    ceRequiredHours: 24,
    renewalUrl: "https://www.idfpr.com/renewals/apply/Forms/renew.asp",
    requirements: [
      "Complete 24 hours of continuing education (CE) within the 2-year renewal period",
      "Ensure at least 12 CE hours are in occupation-based practice or practice-based evidence",
      "Log in to the Illinois IDFPR portal and complete the online renewal application",
      "Pay the $60 renewal fee via credit card or ACH",
      "Upload your renewal confirmation to CareLumi to update this license to Active status",
    ],
  },
  IL_OCCUPATIONAL_THERAPIST: {
    jurisdiction: "Illinois",
    documentType: "Occupational Therapist",
    renewalCycleDays: 730,
    ceRequiredHours: 24,
    renewalUrl: "https://www.idfpr.com/renewals/apply/Forms/renew.asp",
    requirements: [
      "Complete 24 hours of continuing education (CE) within the 2-year renewal period",
      "Ensure at least 12 CE hours are in occupation-based practice or practice-based evidence",
      "Log in to the Illinois IDFPR portal and complete the online renewal application",
      "Pay the $60 renewal fee via credit card or ACH",
      "Upload your renewal confirmation to CareLumi to update this license to Active status",
    ],
  },
}

export function getRegulatoryProfile(
  jurisdiction: string | null,
  documentType: string | null,
): RegulatoryProfile | null {
  if (!jurisdiction || !documentType) return null

  // Normalize keys for lookup
  const normalizedJurisdiction = jurisdiction.trim().toUpperCase().replace(/\s+/g, "_")
  const normalizedDocType = documentType
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/ASSISTANT/g, "")
    .replace(/_+/g, "_")

  // Try exact match
  const key1 = `${normalizedJurisdiction}_${normalizedDocType}`
  if (REGULATORY_PROFILES[key1]) return REGULATORY_PROFILES[key1]

  // Try partial matches (e.g., "IL" instead of "ILLINOIS")
  const stateAbbr = getStateAbbreviation(jurisdiction)
  if (stateAbbr) {
    const key2 = `${stateAbbr}_${normalizedDocType}`
    if (REGULATORY_PROFILES[key2]) return REGULATORY_PROFILES[key2]
  }

  return null
}

function getStateAbbreviation(state: string): string | null {
  const stateMap: Record<string, string> = {
    ILLINOIS: "IL",
    TEXAS: "TX",
    CALIFORNIA: "CA",
    "NEW YORK": "NY",
    FLORIDA: "FL",
  }
  return stateMap[state.trim().toUpperCase()] || null
}
