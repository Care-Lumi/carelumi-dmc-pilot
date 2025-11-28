// Pediatric therapy sandbox data for Kemit Academy
export const SANDBOX_PAYERS = [
  {
    id: "early-intervention-il",
    name: "Illinois Early Intervention Program",
    status: "active",
    type: "State Program",
    stage: "Active Contract",
    lastUpdate: "Speech, OT, and PT services contract active through 6/30/2026.",
    applications: 0,
    activeContracts: 1,
    submittedDate: "2023-09-01",
    approvedDate: "2024-01-15",
  },
  {
    id: "bcbs-il-pediatric",
    name: "Blue Cross Blue Shield IL - Pediatric",
    status: "active",
    type: "Commercial",
    stage: "Active Contract",
    lastUpdate: "Pediatric therapy services network provider agreement active.",
    applications: 0,
    activeContracts: 1,
    submittedDate: "2024-02-10",
    approvedDate: "2024-05-20",
  },
  {
    id: "aetna-il-pediatric",
    name: "Aetna Better Health IL - Pediatric",
    status: "in-progress",
    type: "Medicaid MCO",
    stage: "Credentialing",
    lastUpdate: "2 new speech pathologists in credentialing; ETA 30 days.",
    applications: 1,
    activeContracts: 0,
    submittedDate: "2025-11-01",
  },
  {
    id: "meridian-pediatric",
    name: "Meridian Health - Pediatric Services",
    status: "active",
    type: "Medicaid MCO",
    stage: "Active Contract",
    lastUpdate: "Multi-disciplinary pediatric therapy contract active.",
    applications: 0,
    activeContracts: 1,
    submittedDate: "2024-04-15",
    approvedDate: "2024-07-01",
  },
  {
    id: "united-healthcare-pediatric",
    name: "United Healthcare - Pediatric Network",
    status: "submitted",
    type: "Commercial",
    stage: "Initial Application",
    lastUpdate: "Application for pediatric therapy network submitted 11/15/2025.",
    applications: 1,
    activeContracts: 0,
    submittedDate: "2025-11-15",
  },
]

export const SANDBOX_FACILITIES = [
  {
    id: "kemit-schaumburg",
    name: "Kemit Academy - Schaumburg",
    address: "1600 Golf Rd, Schaumburg, IL 60173",
    status: "compliant",
    licenses: [
      { id: "1", name: "Therapy Clinic License", expiresAt: "2026-10-31" },
      { id: "2", name: "Business License", expiresAt: "2026-08-15" },
      { id: "3", name: "Health Facility Permit", expiresAt: "2026-09-20" },
    ],
    inspections: [],
    statusColor: "text-green-600",
  },
  {
    id: "kemit-oak-park",
    name: "Kemit Academy - Oak Park",
    address: "1010 Lake St, Oak Park, IL 60301",
    status: "compliant",
    licenses: [
      { id: "1", name: "Therapy Clinic License", expiresAt: "2026-12-15" },
      { id: "2", name: "Business License", expiresAt: "2026-07-30" },
    ],
    inspections: [],
    statusColor: "text-green-600",
  },
  {
    id: "kemit-evanston",
    name: "Kemit Academy - Evanston",
    address: "1603 Orrington Ave, Evanston, IL 60201",
    status: "at-risk",
    licenses: [
      { id: "1", name: "Therapy Clinic License", expiresAt: "2026-03-15" },
      { id: "2", name: "Business License", expiresAt: "2026-02-28" },
    ],
    inspections: [],
    statusColor: "text-yellow-600",
  },
]

export const SANDBOX_REGULATORY_UPDATES = [
  {
    id: "il-dhs-ei-standards",
    title: "Illinois DHS – Early Intervention Service Standards Update",
    type: "critical",
    impact: "Critical",
    impactColor: "bg-red-100 text-red-700",
    description:
      "Updated developmental screening requirements and family-centered practice standards for all EI providers. New IFSP documentation format required.",
    effectiveDate: "2026-01-30",
    source: "Illinois Department of Human Services",
    location: "All Locations",
    daysUntilEffective: 40,
    documentsMissing: ["IFSP Template Update", "Staff Training Certificates"],
  },
  {
    id: "il-slp-license-renewal",
    title: "Illinois IDFPR – Speech-Language Pathology License Renewal Changes",
    type: "warning",
    impact: "Warning",
    impactColor: "bg-yellow-100 text-yellow-700",
    description:
      "New continuing education requirements for SLP license renewal: 20 hours required including 2 hours in ethics.",
    effectiveDate: "2026-04-01",
    source: "Illinois IDFPR",
    location: "All Locations",
    daysUntilEffective: 100,
    documentsMissing: [],
  },
]

export const SANDBOX_BILLING_COMPLIANCE = [
  {
    id: "wong",
    provider: "Emily Wong, MS, CCC-SLP",
    payer: "Aetna Better Health IL - Pediatric",
    status: "In-Progress",
    appliedDate: "2025-11-01",
    monthlyAverage: 25000,
    daysBlocked: 20,
    atRisk: 16667,
  },
  {
    id: "patel-ot",
    provider: "Raj Patel, OTR/L",
    payer: "United Healthcare - Pediatric Network",
    status: "In-Progress",
    appliedDate: "2025-11-15",
    monthlyAverage: 28000,
    daysBlocked: 10,
    atRisk: 9333,
  },
]

export const SANDBOX_AUDIT_MISSING = [
  {
    id: "ifsp-signatures",
    item: "IFSP documents with all required signatures (parents & team)",
    category: "Clinical Documentation",
    action: "Obtain missing parent signatures on 3 IFSP documents.",
    status: "incomplete" as const,
    auditTypes: ["general" as const, "state" as const],
  },
  {
    id: "screening-tools",
    item: "Developmental screening tools properly documented",
    category: "Clinical Documentation",
    action: "Upload completed screening tools for 5 recent evaluations.",
    status: "incomplete" as const,
    auditTypes: ["general" as const, "state" as const],
  },
]

export const SANDBOX_AUDIT_COMPLETE_ITEMS = [
  "Professional liability insurance current for all therapists.",
  "Background checks completed and on file for all staff.",
  "Mandated reporter training certificates current (within 12 months).",
  "HIPAA privacy & security training completed for all staff.",
  "Equipment calibration and safety checks documented.",
  "Emergency procedures posted in all therapy rooms.",
  "Infection control protocols documented and followed.",
  "Professional licenses verified and copies on file.",
]

export const SANDBOX_DOCUMENTS = [
  {
    id: "doc-kiley-slp",
    file_name: "slp-license-kiley-russell.pdf",
    document_type: "Speech Pathologist License",
    owner_name: "Kiley Russell",
    owner_id: "staff-kiley",
    owner_type: "staff",
    issue_date: "2024-01-01",
    expiration_date: "2026-02-28",
    license_number: "SLP-047.234567",
    jurisdiction: "Illinois",
    created_at: "2024-01-20",
  },
  {
    id: "doc-amanda-ot",
    file_name: "ot-license-amanda-chen.pdf",
    document_type: "OT Certification",
    owner_name: "Amanda Chen",
    owner_id: "staff-amanda",
    owner_type: "staff",
    issue_date: "2023-07-01",
    expiration_date: "2026-06-30",
    license_number: "OT-112.345678",
    jurisdiction: "Illinois",
    created_at: "2023-07-15",
  },
]
