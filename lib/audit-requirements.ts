// Audit requirement templates defining what documents are required for each audit type

export type AuditType = "general" | "state" | "facility" | "payer"
export type CoverageRule = "current_plus_2_prior" | "current_only" | "custom"
export type AppliesTo = "staff" | "facility" | "payer" | "policy"

export interface AuditRequirement {
  audit_type: AuditType
  doc_type: string
  applies_to: AppliesTo[]
  coverage_rule: CoverageRule
  years_required?: number[] // For custom coverage rules
}

// System-defined audit requirement templates
export const AUDIT_REQUIREMENTS: AuditRequirement[] = [
  // General Audit Requirements
  {
    audit_type: "general",
    doc_type: "Medical License",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "general",
    doc_type: "DEA Certificate",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "general",
    doc_type: "Board Certification",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "general",
    doc_type: "Malpractice Insurance",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "general",
    doc_type: "BLS/ACLS Certification",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },

  // State Regulatory Requirements
  {
    audit_type: "state",
    doc_type: "Medical License",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "state",
    doc_type: "ASC License",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "state",
    doc_type: "Fire Safety Certificate",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "state",
    doc_type: "Health Permit",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },

  // Facility Audit Requirements
  {
    audit_type: "facility",
    doc_type: "ASC License",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "facility",
    doc_type: "Business License",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "facility",
    doc_type: "Fire Safety Certificate",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "facility",
    doc_type: "Inspection Report",
    applies_to: ["facility"],
    coverage_rule: "current_plus_2_prior",
  },

  // Payer-Specific Requirements
  {
    audit_type: "payer",
    doc_type: "Medical License",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "payer",
    doc_type: "Board Certification",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "payer",
    doc_type: "Malpractice Insurance",
    applies_to: ["staff"],
    coverage_rule: "current_plus_2_prior",
  },
  {
    audit_type: "payer",
    doc_type: "Payer Contract",
    applies_to: ["payer"],
    coverage_rule: "current_plus_2_prior",
  },
]

// Get years required based on coverage rule
export function getRequiredYears(rule: CoverageRule, customYears?: number[]): number[] {
  const currentYear = new Date().getFullYear()

  if (rule === "custom" && customYears) {
    return customYears
  }

  if (rule === "current_only") {
    return [currentYear]
  }

  // Default: current_plus_2_prior
  return [currentYear, currentYear - 1, currentYear - 2]
}

// Check if a document covers a specific year
export function documentCoversYear(doc: any, year: number): boolean {
  if (!doc.expiration_date) return false

  const issueDate = doc.issue_date ? new Date(doc.issue_date) : new Date(doc.created_at || doc.uploaded_at)
  const expirationDate = new Date(doc.expiration_date)

  const yearStart = new Date(year, 0, 1) // Jan 1 of year
  const yearEnd = new Date(year, 11, 31, 23, 59, 59) // Dec 31 of year

  // Doc covers year if: issue_date <= Dec 31 of year AND expiration_date >= Jan 1 of year
  return issueDate <= yearEnd && expirationDate >= yearStart
}

// Calculate audit readiness score for a specific audit type
export function calculateAuditScore(
  auditType: AuditType,
  documents: any[],
  entities: { staff: any[]; facilities: any[]; payers: any[] },
): { score: number; totalRequired: number; totalCompleted: number; missingItems: any[]; atRiskItems: any[] } {
  const requirements = AUDIT_REQUIREMENTS.filter((req) => req.audit_type === auditType)
  const currentYear = new Date().getFullYear()
  const sixtyDaysFromNow = new Date()
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60)

  let totalRequired = 0
  let totalCompleted = 0
  const missingItems: any[] = []
  const atRiskItems: any[] = []

  requirements.forEach((req) => {
    const years = getRequiredYears(req.coverage_rule)

    req.applies_to.forEach((entityType) => {
      let entityList: any[] = []

      if (entityType === "staff") entityList = entities.staff
      if (entityType === "facility") entityList = entities.facilities
      if (entityType === "payer") entityList = entities.payers

      entityList.forEach((entity) => {
        years.forEach((year) => {
          totalRequired++

          // Check if ANY document (primary or historical) covers this (entity, doc_type, year)
          const coveringDocs = documents.filter(
            (doc) => doc.owner_id === entity.id && doc.document_type === req.doc_type && documentCoversYear(doc, year),
          )

          if (coveringDocs.length > 0) {
            totalCompleted++

            // Check if document is expiring soon (within 60 days)
            coveringDocs.forEach((doc) => {
              if (doc.expiration_date) {
                const expDate = new Date(doc.expiration_date)
                const now = new Date()

                if (expDate > now && expDate <= sixtyDaysFromNow) {
                  atRiskItems.push({
                    entity_name: entity.name || `${entity.firstName} ${entity.lastName}`,
                    entity_type: entityType,
                    doc_type: req.doc_type,
                    expiration_date: doc.expiration_date,
                    days_until_expiry: Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
                    year,
                  })
                }
              }
            })
          } else {
            // Missing: no document covers this year
            missingItems.push({
              entity_name: entity.name || `${entity.firstName} ${entity.lastName}`,
              entity_type: entityType,
              doc_type: req.doc_type,
              year,
              jurisdiction: entity.jurisdiction || entity.state || "N/A",
            })
          }
        })
      })
    })
  })

  const score = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 100

  return { score, totalRequired, totalCompleted, missingItems, atRiskItems }
}
