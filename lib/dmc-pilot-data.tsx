// DMC Inc Pilot Data - John Cavanagh
// Sample data for pilot deployment with removal capability

export const organizations = {
  dmcInc: {
    name: "DMC Inc",
    shortName: "DMC",
    city: "Arlington",
    state: "TX",
    type: "Surgery Center",
    locations: [
      {
        id: "1",
        name: "DMC Surgery Center - Arlington",
        address: "1234 Medical Plaza Dr, Arlington, TX 76010",
      },
      {
        id: "2",
        name: "DMC Surgery Center - Fort Worth",
        address: "5678 Healthcare Blvd, Fort Worth, TX 76102",
      },
    ],
  },
}

export const userData = {
  name: "John Cavanagh",
  preferredName: "John",
  email: "john@dmc-inc.com",
  role: "Owner",
  // </CHANGE>
  organization: organizations.dmcInc.name,
  city: organizations.dmcInc.city,
  state: organizations.dmcInc.state,
  locations: organizations.dmcInc.locations,
}

// Sample documents for pilot (can be removed)
export const sampleDocuments = [
  {
    id: "sample-1",
    name: "Dr. John Cavanagh - TX Medical License",
    type: "Medical License",
    provider: "Dr. John Cavanagh",
    state: "Texas",
    licenseNumber: "TX-123456",
    issuingBody: "Texas Medical Board",
    issueDate: "2023-03-15",
    expirationDate: "2026-03-15",
    daysUntilExpiration: 478,
    status: "active" as const,
    isSample: true,
    uploadedAt: "2025-11-22",
    classification: {
      documentType: "Medical License",
      jurisdiction: {
        state: "Texas",
        issuingBody: "Texas Medical Board",
      },
      identifiers: {
        licenseNumber: "TX-123456",
        providerName: "Dr. John Cavanagh",
      },
      validity: {
        issueDate: "2023-03-15",
        expirationDate: "2026-03-15",
        isExpired: false,
        daysUntilExpiration: 478,
      },
      compliance: {
        isValid: true,
        missingInfo: [],
        warnings: [],
      },
      nextActions: ["Renewal required by 2026-03-15", "Monitor for regulatory changes"],
    },
  },
  {
    id: "sample-2",
    name: "Dr. John Cavanagh - DEA Certificate",
    type: "DEA Certificate",
    provider: "Dr. John Cavanagh",
    state: "Texas",
    licenseNumber: "BC1234567",
    issuingBody: "Drug Enforcement Administration",
    issueDate: "2024-06-01",
    expirationDate: "2027-06-01",
    daysUntilExpiration: 557,
    status: "active" as const,
    isSample: true,
    uploadedAt: "2025-11-22",
    classification: {
      documentType: "DEA Certificate",
      jurisdiction: {
        state: "Texas",
        issuingBody: "Drug Enforcement Administration",
      },
      identifiers: {
        licenseNumber: "BC1234567",
        providerName: "Dr. John Cavanagh",
      },
      validity: {
        issueDate: "2024-06-01",
        expirationDate: "2027-06-01",
        isExpired: false,
        daysUntilExpiration: 557,
      },
      compliance: {
        isValid: true,
        missingInfo: [],
        warnings: [],
      },
      nextActions: ["Renewal required by 2027-06-01"],
    },
  },
  {
    id: "sample-3",
    name: "DMC Arlington - Facility License",
    type: "Facility Permit",
    facility: "DMC Surgery Center - Arlington",
    state: "Texas",
    licenseNumber: "ASC-TX-9876",
    issuingBody: "Texas Department of State Health Services",
    issueDate: "2024-01-10",
    expirationDate: "2025-12-31",
    daysUntilExpiration: 39,
    status: "expiring" as const,
    isSample: true,
    uploadedAt: "2025-11-22",
    classification: {
      documentType: "Facility License",
      jurisdiction: {
        state: "Texas",
        issuingBody: "Texas Department of State Health Services",
      },
      identifiers: {
        licenseNumber: "ASC-TX-9876",
        facilityName: "DMC Surgery Center - Arlington",
      },
      validity: {
        issueDate: "2024-01-10",
        expirationDate: "2025-12-31",
        isExpired: false,
        daysUntilExpiration: 39,
      },
      compliance: {
        isValid: true,
        missingInfo: [],
        warnings: ["Expires in 39 days - renewal required"],
      },
      nextActions: [
        "URGENT: Renewal required by 2025-12-31",
        "Application deadline approximately 2025-11-30",
        "Facility inspection may be required",
      ],
    },
  },
]

// Sample dashboard metrics derived from sample documents
export const sampleMetrics = {
  revenueAtRisk: {
    amount: 8500,
    providerCount: 1,
    trend: 0,
    status: "medium" as const,
    providers: [
      {
        name: "Dr. John Cavanagh",
        amount: 8500,
        reason: "Facility license expiring in 39 days - blocks all procedures",
      },
    ],
  },

  credentialingPipeline: {
    total: 1,
    blocked: 0,
    active: 1,
    approved: 0,
    applications: [
      {
        id: "sample-cred-1",
        provider: "Dr. John Cavanagh",
        payer: "Medicare",
        status: "active",
        reason: "Initial enrollment in progress",
        daysInProgress: 45,
        isSample: true,
      },
    ],
  },

  expiringSoon: {
    total: 1,
    critical: 1, // <30 days
    warning: 0, // 30-60 days
    items: [
      {
        id: "sample-1",
        name: "DMC Arlington - Facility License",
        daysUntilExpiration: 39,
        type: "critical",
        isSample: true,
      },
    ],
  },

  auditReadiness: {
    percentage: 60,
    missingItems: 4,
    totalItems: 10,
    completedItems: 6,
    items: [
      { id: "1", name: "Medical Director License", status: "complete", isSample: true },
      { id: "2", name: "DEA Certificate", status: "complete", isSample: true },
      { id: "3", name: "Facility License", status: "complete", isSample: true },
      { id: "4", name: "Malpractice Insurance", status: "incomplete" },
      { id: "5", name: "Staff Credentials", status: "incomplete" },
      { id: "6", name: "Anesthesiologist License", status: "incomplete" },
      { id: "7", name: "Fire Safety Inspection", status: "incomplete" },
      { id: "8", name: "AAAHC Accreditation", status: "complete", isSample: true },
      { id: "9", name: "Infection Control Plan", status: "complete", isSample: true },
      { id: "10", name: "Emergency Procedures", status: "complete", isSample: true },
    ],
  },
}

// Critical alerts for sample data
export const sampleAlerts = [
  {
    id: "sample-alert-1",
    status: "error" as const,
    title: "DMC Arlington - Facility License expires in 39 days",
    subtitle: "TX ASC License #ASC-TX-9876 • Due 12/31/2025",
    dueDate: "2025-12-31",
    actionLabel: "Review Renewal",
    isSample: true,
  },
]

// Empty state data (when sample data is removed)
export const emptyState = {
  revenueAtRisk: {
    amount: 0,
    providerCount: 0,
    trend: 0,
    status: "low" as const,
    providers: [],
  },

  credentialingPipeline: {
    total: 0,
    blocked: 0,
    active: 0,
    approved: 0,
    applications: [],
  },

  expiringSoon: {
    total: 0,
    critical: 0,
    warning: 0,
    items: [],
  },

  auditReadiness: {
    percentage: 0,
    missingItems: 0,
    totalItems: 0,
    completedItems: 0,
    items: [],
  },
}

// Helper to check if sample data is active
export const isSampleDataActive = () => {
  if (typeof window === "undefined") return true // SSR default
  const sampleDataFlag = localStorage.getItem("carelumi_sample_data")
  return sampleDataFlag !== "removed"
}

// Helper to remove sample data
export const removeSampleData = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("carelumi_sample_data", "removed")
  }
}

// Helper to restore sample data
export const restoreSampleData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("carelumi_sample_data")
  }
}
