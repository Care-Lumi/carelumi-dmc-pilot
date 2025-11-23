// Placeholder data for CareLumi dashboard demo

export const organizations = {
  andaTherapy: {
    name: "Anda Therapy Group",
    shortName: "Anda Therapy",
    city: "Chicago",
    state: "IL",
    locations: [
      { id: "1", name: "Chicago - Main", address: "5 E. 14th Place, Chicago, IL 60605" },
      { id: "2", name: "Naperville", address: "123 Main St, Naperville, IL 60540" },
      { id: "3", name: "Oak Park", address: "456 Oak Ave, Oak Park, IL 60302" },
    ],
  },
  kemitAcademy: {
    name: "Kemit Academy",
    shortName: "Kemit Academy",
    city: "Springfield",
    state: "IL",
    locations: [
      { id: "1", name: "Springfield - Main", address: "789 Lincoln Ave, Springfield, IL 62701" },
      { id: "2", name: "Bloomington", address: "321 Normal St, Bloomington, IL 61701" },
    ],
  },
}

export const userData = {
  name: "Alex Chen",
  preferredName: "Alex",
  organization: organizations.andaTherapy.name,
  city: organizations.andaTherapy.city,
  state: organizations.andaTherapy.state,
  locations: organizations.andaTherapy.locations,
}

export const criticalAlerts = [
  {
    id: "1",
    status: "error" as const,
    title: "Dr. Martinez – License expires in 15 days",
    subtitle: "Illinois LSW #12345 • Due 12/01/2025",
    dueDate: "2025-12-01",
    actionLabel: "Review & Renew",
  },
  {
    id: "2",
    status: "warning" as const,
    title: "County Care credentialing renewal due",
    subtitle: "Re-attestation required • Due 12/15/2025",
    dueDate: "2025-12-15",
    actionLabel: "Attest Now",
  },
  {
    id: "3",
    status: "warning" as const,
    title: "Fire safety inspection scheduled",
    subtitle: "Naperville location • 12/10/2025",
    dueDate: "2025-12-10",
    actionLabel: "Review Requirements",
  },
]

// Revenue at Risk data
export const revenueAtRiskData = {
  amount: 25247,
  providerCount: 3,
  trend: -18, // negative means improvement (less risk)
  status: "high" as const, // high | medium | low
  providers: [
    { name: "Dr. Sarah Martinez", amount: 13000, reason: "IL LSW License expired" },
    { name: "John Davis, RBT", amount: 8000, reason: "Background check expired" },
    { name: "Emily Chen, BCBA", amount: 4247, reason: "Medicaid credentialing pending" },
  ],
}

// Updated revenueAtRiskDetails with applied dates and actions
export const revenueAtRiskDetails = [
  {
    id: "1",
    provider: "Dr. Sarah Martinez",
    payer: "Aetna",
    status: "In Progress" as const,
    applicationDate: "2025-10-01",
    appliedDate: "2025-10-01",
    daysBlocked: 51,
    monthlyAverage: 6000,
    atRisk: 10200,
    note: "Applied 10/1/25 - 51 days in progress",
    actions: ["Use Clip"],
  },
  {
    id: "2",
    provider: "Dr. Sarah Martinez",
    payer: "BlueCross BlueShield",
    status: "Missing Documents" as const,
    applicationDate: "2025-10-08",
    appliedDate: "2025-10-08",
    daysBlocked: 44,
    monthlyAverage: 3000,
    atRisk: 4400,
    note: "Missing attestation - Action required",
    actions: ["Use Clip"],
  },
  {
    id: "3",
    provider: "Jane Smith, LCSW",
    payer: "IL Medicaid",
    status: "In Progress" as const,
    applicationDate: "2025-10-15",
    appliedDate: "2025-10-15",
    daysBlocked: 37,
    monthlyAverage: 5000,
    atRisk: 6167,
    note: "License verification - 37 days",
    actions: ["Use Clip"],
  },
  {
    id: "4",
    provider: "Emily Chen, BCBA",
    payer: "UnitedHealthcare",
    status: "In Progress" as const,
    applicationDate: "2025-10-20",
    appliedDate: "2025-10-20",
    daysBlocked: 32,
    monthlyAverage: 4200,
    atRisk: 4480,
    note: "Under payer review",
    actions: ["Use Clip"],
  },
]

// Credentialing Pipeline data
export const credentialingPipelineData = {
  total: 4,
  blocked: 2,
  active: 2,
  approved: 0,
  applications: [
    {
      id: "1",
      provider: "Dr. Martinez",
      payer: "BlueCross BlueShield",
      status: "blocked",
      reason: "Missing liability insurance",
      daysInProgress: 45,
    },
    {
      id: "2",
      provider: "Sarah Johnson",
      payer: "Aetna",
      status: "blocked",
      reason: "Pending background check",
      daysInProgress: 30,
    },
    {
      id: "3",
      provider: "Michael Chen",
      payer: "County Care (Medicaid)",
      status: "active",
      reason: "In payer review",
      daysInProgress: 15,
    },
    {
      id: "4",
      provider: "Lisa Park",
      payer: "UnitedHealthcare",
      status: "active",
      reason: "Application submitted",
      daysInProgress: 8,
    },
  ],
}

// Expiring Soon data
export const expiringSoonData = {
  total: 5,
  critical: 2, // <30 days
  warning: 3, // 30-60 days
  items: [
    { id: "1", name: "Dr. Martinez - IL LSW License", daysUntilExpiration: 15, type: "critical" },
    { id: "2", name: "John Davis - CPR Certification", daysUntilExpiration: 22, type: "critical" },
    { id: "3", name: "Sarah Lee - Background Check", daysUntilExpiration: 35, type: "warning" },
    { id: "4", name: "Michael Chen - TB Test", daysUntilExpiration: 42, type: "warning" },
    { id: "5", name: "Jane Smith - CEU Hours", daysUntilExpiration: 58, type: "warning" },
  ],
}

// Audit Readiness data
export const auditReadinessData = {
  percentage: 87,
  missingItems: 3,
  totalItems: 23,
  completedItems: 20,
  items: [
    { id: "1", name: "Staff credentials tracking", status: "complete" },
    { id: "2", name: "Facility licenses current", status: "complete" },
    { id: "3", name: "Background checks on file", status: "incomplete" },
    { id: "4", name: "Professional liability insurance", status: "incomplete" },
    { id: "5", name: "Fire safety compliance", status: "incomplete" },
  ],
}

// Comprehensive staff data for Staff Credentials module
export const staffMembers = [
  {
    id: "1",
    name: "Dr. Sarah Martinez",
    role: "LSW",
    status: "expiring",
    licenses: [
      {
        id: "1",
        type: "Illinois LSW",
        number: "12345",
        status: "active",
        expiresAt: "2025-12-01",
        daysUntilExpiration: 15,
        lastVerified: "2025-11-15",
      },
    ],
    certifications: [
      { id: "1", type: "CPR Certification", status: "current", expiresAt: "2026-06-15" },
      { id: "2", type: "CEU Hours", status: "in-progress", current: 15, required: 20, dueDate: "2025-12-31" },
    ],
    location: "Chicago - Main",
  },
  {
    id: "2",
    name: "John Davis",
    role: "RBT",
    status: "compliant",
    licenses: [
      {
        id: "1",
        type: "RBT Certification",
        number: "RBT-67890",
        status: "active",
        expiresAt: "2026-08-15",
        daysUntilExpiration: 265,
        lastVerified: "2025-11-01",
      },
    ],
    certifications: [
      { id: "1", type: "CPR Certification", status: "expiring", expiresAt: "2025-12-07", daysUntilExpiration: 22 },
      { id: "2", type: "Background Check", status: "current", expiresAt: "2026-03-20" },
    ],
    location: "Chicago - Main",
  },
  {
    id: "3",
    name: "Emily Chen",
    role: "BCBA",
    status: "compliant",
    licenses: [
      {
        id: "1",
        type: "Illinois BCBA",
        number: "BCBA-11223",
        status: "active",
        expiresAt: "2026-05-10",
        daysUntilExpiration: 195,
        lastVerified: "2025-10-20",
      },
    ],
    certifications: [
      { id: "1", type: "CPR Certification", status: "current", expiresAt: "2026-07-01" },
      { id: "2", type: "Background Check", status: "current", expiresAt: "2026-09-15" },
    ],
    location: "Naperville",
  },
  {
    id: "4",
    name: "Sarah Lee",
    role: "LPC",
    status: "expiring",
    licenses: [
      {
        id: "1",
        type: "Illinois LPC",
        number: "LPC-44556",
        status: "active",
        expiresAt: "2026-02-20",
        daysUntilExpiration: 125,
        lastVerified: "2025-11-10",
      },
    ],
    certifications: [
      { id: "1", type: "Background Check", status: "expiring", expiresAt: "2025-12-10", daysUntilExpiration: 25 },
      { id: "2", type: "CPR Certification", status: "current", expiresAt: "2026-04-10" },
    ],
    location: "Oak Park",
  },
  {
    id: "5",
    name: "Michael Chen",
    role: "LSW",
    status: "expiring",
    licenses: [
      {
        id: "1",
        type: "Illinois LSW",
        number: "LSW-77889",
        status: "active",
        expiresAt: "2026-03-15",
        daysUntilExpiration: 148,
        lastVerified: "2025-11-12",
      },
    ],
    certifications: [
      { id: "1", type: "TB Test", status: "expiring", expiresAt: "2026-01-10", daysUntilExpiration: 56 },
      { id: "2", type: "CPR Certification", status: "current", expiresAt: "2026-08-20" },
    ],
    location: "Chicago - Main",
  },
  {
    id: "6",
    name: "Jane Smith",
    role: "LCSW",
    status: "compliant",
    licenses: [
      {
        id: "1",
        type: "Illinois LCSW",
        number: "LCSW-99001",
        status: "active",
        expiresAt: "2026-06-30",
        daysUntilExpiration: 255,
        lastVerified: "2025-11-05",
      },
    ],
    certifications: [
      {
        id: "1",
        type: "CEU Hours",
        status: "in-progress",
        current: 8,
        required: 20,
        dueDate: "2026-01-22",
        daysUntilDue: 58,
      },
      { id: "2", type: "CPR Certification", status: "current", expiresAt: "2026-09-10" },
    ],
    location: "Naperville",
  },
  {
    id: "7",
    name: "Samuel Osei Boateng",
    role: "OTA",
    status: "expiring",
    email: "soboateng@andatherapy.com",
    phone: "(312) 555-0147",
    licenses: [
      {
        id: "1",
        type: "Illinois Occupational Therapy Assistant",
        number: "057.005783",
        accessId: "4558802",
        status: "active",
        expiresAt: "2025-12-31",
        daysUntilExpiration: 40,
        lastVerified: "2025-11-15",
        address: "3530 S Lake Park Ave, Apt 102, Chicago, IL 60653",
      },
    ],
    certifications: [
      { id: "1", type: "CPR Certification", status: "current", expiresAt: "2026-09-10" },
      { id: "2", type: "Background Check", status: "current", expiresAt: "2026-05-20" },
    ],
    location: "Chicago - Main",
  },
]

// Payer credentialing data
export const payerCredentialing = [
  {
    id: "1",
    name: "County Care",
    type: "Medicaid",
    status: "active",
    providerCount: 2,
    approvedDate: "2025-12-15",
    providers: [
      {
        id: "1",
        name: "Dr. Sarah Martinez",
        providerId: "CC-123456",
        status: "active",
        recredentialingDue: "2027-12-15",
      },
      { id: "2", name: "Michael Chen", providerId: "CC-789012", status: "active", recredentialingDue: "2027-12-15" },
    ],
    contractTerms: [
      "LSW Rate: $65 per session",
      "Covered Services: Individual therapy, group therapy",
      "Authorization required: Yes",
    ],
  },
  {
    id: "2",
    name: "Meridian Health",
    type: "Medicaid MCO",
    status: "in-progress",
    providerCount: 2,
    submittedDate: "2025-11-17",
    providers: [
      {
        id: "1",
        name: "Emily Chen",
        providerId: "pending",
        status: "pending-info",
        note: "Waiting for liability insurance",
      },
      { id: "2", name: "Jane Smith", providerId: "pending", status: "under-review", note: "Application under review" },
    ],
  },
  {
    id: "3",
    name: "Aetna",
    type: "Commercial",
    status: "submitted",
    providerCount: 1,
    submittedDate: "2025-11-15",
    providers: [
      {
        id: "1",
        name: "Sarah Lee",
        providerId: "pending",
        status: "submitted",
        note: "Application submitted, awaiting review",
      },
    ],
  },
  {
    id: "4",
    name: "BlueCross BlueShield",
    type: "Commercial",
    status: "missing-documents",
    providerCount: 1,
    submittedDate: "2025-10-01",
    providers: [
      {
        id: "1",
        name: "Dr. Sarah Martinez",
        providerId: "pending",
        status: "missing-documents",
        note: "Missing liability insurance",
      },
    ],
  },
  {
    id: "5",
    name: "UnitedHealthcare",
    type: "Commercial",
    status: "in-progress",
    providerCount: 1,
    submittedDate: "2025-11-08",
    providers: [
      { id: "1", name: "John Davis", providerId: "pending", status: "under-review", note: "Application submitted" },
    ],
  },
  {
    id: "6",
    name: "Humana",
    type: "Commercial",
    status: "active",
    providerCount: 1,
    approvedDate: "2025-09-20",
    providers: [
      { id: "1", name: "Emily Chen", providerId: "HUM-445566", status: "active", recredentialingDue: "2027-09-20" },
    ],
  },
]

// Facility/location data
export const facilities = [
  {
    id: "1",
    name: "Chicago - Main",
    address: "5 E. 14th Place, Chicago, IL 60605",
    status: "compliant",
    licenses: [
      {
        id: "1",
        type: "Illinois Behavioral Health Facility License",
        number: "BH-12345",
        status: "active",
        expiresAt: "2026-06-30",
        daysUntilExpiration: 255,
      },
    ],
    inspections: [
      { id: "1", type: "Fire Safety Inspection", status: "current", expiresAt: "2026-03-15", daysUntilExpiration: 148 },
      { id: "2", type: "Health Department", status: "current", expiresAt: "2026-09-20", daysUntilExpiration: 337 },
      { id: "3", type: "Occupancy Certificate", status: "current", expiresAt: "2027-01-10" },
    ],
  },
  {
    id: "2",
    name: "Naperville",
    address: "123 Main St, Naperville, IL 60540",
    status: "compliant",
    licenses: [
      {
        id: "1",
        type: "Illinois Behavioral Health Facility License",
        number: "BH-67890",
        status: "active",
        expiresAt: "2026-08-15",
        daysUntilExpiration: 301,
      },
    ],
    inspections: [
      { id: "1", type: "Fire Safety Inspection", status: "scheduled", scheduledDate: "2025-12-10", daysUntil: 25 },
      { id: "2", type: "Health Department", status: "current", expiresAt: "2026-07-30", daysUntilExpiration: 285 },
      { id: "3", type: "Occupancy Certificate", status: "current", expiresAt: "2026-11-20" },
    ],
  },
  {
    id: "3",
    name: "Oak Park",
    address: "456 Oak Ave, Oak Park, IL 60302",
    status: "compliant",
    licenses: [
      {
        id: "1",
        type: "Illinois Behavioral Health Facility License",
        number: "BH-11223",
        status: "active",
        expiresAt: "2026-04-20",
        daysUntilExpiration: 184,
      },
    ],
    inspections: [
      { id: "1", type: "Fire Safety Inspection", status: "current", expiresAt: "2026-05-10", daysUntilExpiration: 204 },
      { id: "2", type: "Health Department", status: "current", expiresAt: "2026-10-15", daysUntilExpiration: 362 },
      { id: "3", type: "Occupancy Certificate", status: "current", expiresAt: "2027-02-28" },
    ],
  },
]

// Regulatory updates data
export const regulatoryUpdates = [
  {
    id: "1",
    title: "Illinois Medicaid - New Documentation Requirements",
    type: "critical",
    description: "Telehealth sessions now require consent form signed within 24 hours of first session.",
    source: "Illinois DCFS",
    effectiveDate: "2025-12-01",
    daysUntilEffective: 16,
    impact: "15 staff members at Chicago location",
    documentsMissing: ["Updated consent forms"],
    affectedLocations: ["Chicago - Main"],
  },
  {
    id: "2",
    title: "CMS Update - Billing Code Changes",
    type: "informational",
    description: "New CPT codes for behavioral health services effective January 1, 2026.",
    source: "CMS",
    effectiveDate: "2026-01-01",
    daysUntilEffective: 57,
    impact: "For your awareness",
    documentsMissing: [],
    affectedLocations: ["All"],
  },
  {
    id: "3",
    title: "Fire Safety Code Updates - Illinois",
    type: "warning",
    description: "All locations must have updated fire suppression systems inspected by March 1, 2026.",
    source: "Illinois State Fire Marshal",
    effectiveDate: "2026-03-01",
    daysUntilEffective: 133,
    impact: "3 locations require inspection",
    documentsMissing: ["Updated fire safety inspection reports"],
    affectedLocations: ["Chicago - Main", "Naperville", "Oak Park"],
  },
]

// Documents data
export const documentsData = {
  categories: [
    { id: "1", name: "Staff Credentials", count: 47 },
    { id: "2", name: "Payer Contracts", count: 6 },
    { id: "3", name: "Facility Licenses", count: 3 },
    { id: "4", name: "Policies & SOPs", count: 12 },
  ],
  recentUploads: [
    { id: "1", name: "Dr. Martinez - CPR Certificate", uploadedAt: "2 hours ago", category: "Staff Credentials" },
    { id: "2", name: "County Care - Contract Amendment", uploadedAt: "Yesterday", category: "Payer Contracts" },
    { id: "3", name: "Fire Safety Inspection - Naperville", uploadedAt: "2 days ago", category: "Facility Licenses" },
  ],
}
