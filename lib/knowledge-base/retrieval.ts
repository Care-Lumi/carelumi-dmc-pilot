// Simple RAG retrieval system without external dependencies

export interface KnowledgeDocument {
  id: string
  title: string
  content: string
  category: string
}

export interface SearchResult {
  document: KnowledgeDocument
  relevance: number
  matchedChunks: string[]
}

// Knowledge base documents
export const knowledgeBase: KnowledgeDocument[] = [
  {
    id: "getting-started",
    title: "Getting Started with CareLumi",
    content: `CareLumi is a compliance and credentialing platform that centralizes provider licenses, facility documents, staff compliance, payer credentialing, and regulatory workflows across multi-state operations.

Platform Overview:
CareLumi serves as a unified system where compliance teams, credentialing specialists, and facility administrators can manage documentation, track expirations, prepare for inspections, and coordinate workflows across multiple states and locations.

Pilot Mode:
The pilot is a limited trial of the full platform. It allows you to upload documents, explore the interface, and understand how CareLumi organizes complex compliance data. The pilot does not include live integrations, automated monitoring, or state-specific regulatory logic—those features unlock after upgrade.

Key Capabilities:
- Provider Management: Track licenses, certifications, DEA, malpractice insurance, and credentialing across multiple states
- Facility Compliance: Organize facility licenses, accreditation, inspections, and location-specific documents
- Payer Credentialing: Manage Medicare, Medicaid, and commercial payer participation and contracting
- Staff Compliance: Monitor staff licenses, training requirements, and role-specific certifications
- Document Management: Centralized repository with expiration tracking, version control, and renewal alerts
- Audit Readiness: Compliance scoring, gap identification, and inspection preparation workflows
- Multi-State Coordination: Enterprise visibility across all locations, providers, and regulatory requirements

Getting Started:
1. Navigate the dashboard to see stats on expiring documents, compliance gaps, and recent activity
2. Upload provider and facility documents to see how CareLumi organizes them
3. Create provider profiles and attach licenses, certifications, and payer contracts
4. Set up facility locations with state-specific documents and accreditation materials
5. Add staff members and track their compliance requirements
6. Explore Clip (AI assistant) to ask questions about your data and platform features

Pilot vs Full Platform:
Pilot allows document upload, organization, and manual tracking. The full platform adds automated monitoring, regulatory calendars, live integrations with state boards and payers, and enterprise-wide compliance workflows.

Next Steps:
- Upload representative documents from your operations
- Test how the platform handles your specific multi-state complexity
- Evaluate whether your teams can find information easily
- Prepare your data for migration to the full platform after upgrade`,
    category: "Platform",
  },
  {
    id: "dashboard-organization",
    title: "Dashboard & Organization Setup",
    content: `The CareLumi dashboard provides a centralized view of your compliance status, upcoming deadlines, and recent activity across all providers, facilities, and staff.

Dashboard Overview:
The main dashboard displays key metrics:
- Documents expiring soon (next 30/60/90 days)
- Compliance score and gaps
- Recent uploads and updates
- Locations with incomplete documentation
- Providers needing credential renewals
- Payer credentialing status
- Staff compliance percentages
- Upcoming inspection dates

Organization Setup:
Before uploading documents, configure your organization structure:

Locations:
- Create a facility record for each physical location
- Add location details: name, address, license number, accreditation status
- Assign location type: ASC, outpatient clinic, surgery center, hospital, clinic
- Upload location-specific documents: facility licenses, certificates of need, fire marshal inspections, accreditation letters

Staff Roles:
- Define roles within your organization: administrator, compliance officer, credentialing specialist, facility manager
- Assign permissions based on role needs
- Add staff members with contact information and role assignments
- Track staff-specific compliance requirements by role

Payer Networks:
- Create records for payers you work with: Medicare, Medicaid, state Medicaid programs, commercial insurers
- Document network participation agreements
- Track credentialing requirements per payer
- Assign providers to specific payer networks
- Monitor credentialing status and renewal deadlines

Document Organization:
CareLumi organizes documents by:
- Provider: licenses, certifications, DEA, malpractice, hospital privileges, training
- Facility: licenses, accreditation, inspections, insurance, policies
- Payer: contracts, participation agreements, credentialing applications
- Staff: licenses, certifications, training records, competency assessments

Expiration Tracking:
Documents with expiration dates trigger alerts:
- 90 days before: Initial reminder
- 60 days before: Follow-up alert
- 30 days before: Urgent notification
- 7 days before: Critical alert

Dashboard displays all documents by expiration timeline, allowing you to prioritize renewal activities.

Multi-Location View:
For organizations with multiple facilities, the dashboard aggregates data across all locations while allowing filtering by specific facility. This enables enterprise-wide visibility and location-specific management.

Customization:
Configure dashboard widgets to show metrics most relevant to your role and priorities. Compliance officers may focus on expiration timelines, while administrators prioritize audit readiness scores.`,
    category: "Platform",
  },
  {
    id: "provider-management",
    title: "Provider Management",
    content: `Provider management in CareLumi centralizes all credentialing, licensing, and payer participation data for physicians, nurse practitioners, physician assistants, and other clinical staff.

Creating Provider Profiles:
Each provider gets a dedicated profile containing:
- Demographic information: name, contact, specialty, practice locations
- State licenses: license numbers, states, issue/expiration dates, license types
- Board certifications: specialty, board, certification date, expiration
- DEA registrations: registration numbers, schedules, locations, expiration
- Malpractice insurance: policy details, coverage amounts, effective/expiration dates
- Hospital privileges: facility names, privilege types, granted/expiration dates
- Education and training: medical school, residency, fellowships, CME
- Payer credentialing: Medicare/Medicaid/commercial network participation status

Document Upload:
Upload provider documents directly to their profile:
- License certificates (PDF/image)
- Board certification cards
- DEA certificates
- Insurance declarations pages
- Privilege letters
- Training certificates
- CME transcripts

Multi-State License Tracking:
For providers practicing in multiple states, CareLumi displays all licenses in one profile with:
- Clear visual distinction between states
- Independent expiration tracking per state
- Renewal reminders customized by state requirements
- Supervision or collaboration requirements (for NPs/PAs)
- Scope of practice variations by state

The platform organizes multi-state licenses chronologically and alphabetically, making it easy to see which licenses need attention.

Credentialing Workflows:
Track the credentialing lifecycle:
- Initial application: checklist of required documents
- Submission: date submitted, payer/facility contact
- In progress: status updates, additional requests
- Approved: effective date, next renewal
- Re-credentialing: timeline based on 2-year cycles

Expiration Monitoring:
Automated alerts for upcoming expirations:
- Licenses
- Board certifications
- DEA registrations
- Malpractice insurance
- Hospital privileges
- Payer credentialing renewals

Document Completeness:
Each provider profile shows completion percentage based on required documents. Incomplete profiles are flagged on the dashboard for follow-up.

Payer Participation:
Assign providers to payer networks and track:
- Application status
- Effective dates
- Network participation agreements
- Re-credentialing deadlines
- Claims submission authorization

Provider Reports:
Generate reports showing:
- All providers by location
- Expiring credentials by timeframe
- Incomplete credentialing files
- Multi-state license summary
- Payer participation by provider

Pilot Limitations:
The pilot allows manual upload and organization of provider documents. The full platform adds automated verification with state boards, NPDB queries, payer portal integrations, and real-time credentialing status updates.`,
    category: "Providers",
  },
  {
    id: "facility-management",
    title: "Facility Management",
    content: `Facility management in CareLumi organizes licenses, accreditation, inspections, and compliance documentation for ASCs, outpatient clinics, surgery centers, and other healthcare locations.

Facility Profiles:
Each facility location has a profile containing:
- Basic information: name, address, phone, administrator, type
- State license: number, issue/expiration dates, license type, number of ORs
- Federal certification: Medicare certification number, effective date
- Accreditation: accrediting body (AAAHC, ACHC, Joint Commission), status, survey dates, expiration
- Inspections: state surveys, fire marshal, CMS validation, complaint investigations
- Insurance: malpractice, general liability, property, policy numbers, coverage amounts
- Policies and procedures: policy manuals, safety plans, emergency preparedness

Document Upload:
Upload facility-specific documents:
- State license certificates
- Medicare certification letters
- Accreditation certificates and survey reports
- Inspection reports and Plans of Correction
- Insurance declarations pages
- Policies and procedure manuals
- Fire marshal inspection certificates
- Equipment maintenance logs
- Staff training records

Multi-Location Tracking:
For organizations operating facilities in multiple states, CareLumi provides:
- Consolidated view of all locations with compliance status
- State-specific license and inspection requirements
- Centralized policy library with location-specific addenda
- Enterprise-wide accreditation tracking
- Cross-location staff assignments and compliance

Inspection Preparation:
Track inspection cycles and prepare for surveys:
- Inspection calendar: scheduled surveys, due dates, overdue indicators
- Preparation checklist: document review, staff credential verification, policy updates, equipment checks
- Previous findings: history of deficiencies and corrective actions
- Mock surveys: schedule internal audits to identify gaps before official inspections

Survey Findings and Corrections:
When inspection reports are uploaded:
- Extract deficiency findings
- Assign corrective actions to responsible staff
- Set deadlines for Plan of Correction submission
- Track implementation of corrections
- Document evidence of compliance
- Prepare for follow-up surveys

Accreditation Management:
Track accreditation lifecycle:
- Survey scheduling: anticipated survey windows
- Document submission: required pre-survey materials
- On-site survey: coordination and preparation
- Post-survey: review findings, implement corrective actions
- Renewal: track 3-year accreditation cycles

Policy Management:
Centralized policy repository:
- Version control: track policy revisions and effective dates
- Distribution: assign policies to specific facilities or enterprise-wide
- Acknowledgment: staff sign-off on policy review
- Updates: flag outdated policies for review
- Regulatory alignment: link policies to regulatory requirements

Facility Reports:
Generate reports for:
- License and certification status by location
- Upcoming inspections and accreditation surveys
- Deficiency trends across facilities
- Policy distribution and acknowledgment rates
- Document completeness by facility

Multi-State Expansion:
For organizations planning new facilities:
- Create facility profile for new location
- Track licensing application process
- Document construction and regulatory approvals
- Prepare for initial surveys
- Replicate policies from existing locations with state-specific modifications

Pilot Limitations:
The pilot allows organizing facility documents manually. The full platform adds state-specific regulatory calendars, automated inspection scheduling, accreditation body integrations, and structured expansion project workflows.`,
    category: "Facilities",
  },
  {
    id: "payer-credentialing",
    title: "Payer Credentialing",
    content: `Payer credentialing in CareLumi tracks provider and facility participation with Medicare, Medicaid, and commercial insurance networks across multiple states.

Payer Network Setup:
Create records for each payer:
- Medicare (federal program)
- Medicaid (state-specific programs for each state where you operate)
- Managed Medicaid organizations (state MCOs)
- Commercial insurers (Blue Cross, UnitedHealthcare, Aetna, Cigna, Humana, etc.)
- Regional plans specific to your markets

Payer Information:
Document payer details:
- Payer name and type
- Contract effective dates
- Network participation agreements
- Credentialing contact information
- Provider enrollment portals
- Claims submission requirements
- Reimbursement rates and fee schedules

Provider Credentialing:
Track provider enrollment with each payer:
- Application submission date
- Documents submitted
- Application status (pending, in review, approved, denied)
- Credentialing committee review dates
- Effective date of participation
- Provider identifier numbers (NPI, payer-specific IDs)
- Network tier (if applicable)
- Re-credentialing due dates (typically every 2 years)

Facility Credentialing:
Track facility enrollment:
- Facility application status
- Site visits and inspections
- Participation agreements
- Facility identifier numbers
- Service authorizations (specific procedures or services covered)
- Contract renewal dates

Medicare/Medicaid Specifics:
Medicare:
- PECOS enrollment tracking
- 855B (facility) and 855I (provider) application status
- CLIA certification (if applicable)
- Reassignment of benefits
- Opt-out status (if relevant)

Medicaid:
- State-specific enrollment by state
- MCO credentialing separate from state Medicaid
- State provider ID numbers
- Enrollment effective dates per state
- Re-validation cycles (varies by state)

Commercial Credentialing:
- Primary source verification requirements
- Application completeness
- Credentialing timeline (60-90 days typical)
- CAQH profile maintenance
- Payer-specific forms and attestations

Credentialing Workflows:
Initial credentialing process:
1. Collect provider documents (licenses, certifications, DEA, insurance)
2. Complete payer applications
3. Submit to payer credentialing department
4. Track status and respond to additional requests
5. Receive approval and effective date
6. Configure provider in billing system

Re-credentialing process:
- Monitor re-credentialing due dates (typically 2-year cycles)
- Update provider documents
- Submit re-credentialing applications
- Verify continued participation

Credentialing Status Dashboard:
View all providers and facilities by payer:
- Providers enrolled vs. pending by network
- Credentialing applications in progress
- Upcoming re-credentialing deadlines
- Incomplete applications requiring follow-up
- Denied applications needing appeal

Multi-State Coordination:
For multi-state operations:
- Track Medicaid enrollment by state for each provider
- Monitor commercial payer contracts that vary by state
- Coordinate credentialing for providers practicing at multiple locations
- Ensure facility participation aligns with provider networks

Document Management:
Upload payer-related documents:
- Participation agreements and contracts
- Credentialing applications
- Approval letters
- Fee schedules
- Provider roster listings
- Correspondence with payer credentialing

Payer Reports:
Generate reports:
- Provider participation by payer
- Credentialing pipeline (applications in progress)
- Re-credentialing due dates
- Credentialing gaps (providers not enrolled with key payers)
- Network coverage by location

Pilot Limitations:
The pilot allows organizing payer contracts and tracking credentialing status manually. The full platform adds centralized credentialing workflows, reminders triggered by due dates, and high-level coordination tools for multi-state credentialing. No live PECOS, Medicaid portal, or MCO integrations in the pilot—those require the full platform.`,
    category: "Payers",
  },
  {
    id: "staff-compliance",
    title: "Staff Compliance",
    content: `Staff compliance in CareLumi tracks licenses, certifications, training, and role-specific requirements for all non-provider employees.

Staff Categories:
CareLumi manages compliance for:
- Nursing staff (RNs, LPNs, surgical techs, nurse managers)
- Administrative staff (facility administrators, office managers, billing staff)
- Clinical support staff (medical assistants, radiology techs, anesthesia techs)
- Ancillary staff (environmental services, maintenance, IT support)

Staff Profiles:
Each staff member has a profile with:
- Personal information: name, contact, hire date, role, assigned locations
- State licenses: nursing licenses, tech certifications (by state for multi-state staff)
- Certifications: BLS, ACLS, PALS, specialty certifications
- Training records: orientation, annual training, competency assessments
- Background checks: dates completed, expiration dates
- Health requirements: immunizations, TB tests, health screenings
- OSHA training: bloodborne pathogens, hazard communication, ergonomics

Document Upload:
Upload staff documents:
- License certificates
- Certification cards (BLS, ACLS, specialty)
- Training certificates
- Competency assessment forms
- Background check reports
- Immunization records
- Health screening results

License and Certification Tracking:
Monitor expirations:
- State nursing licenses (typically 2-year renewal cycles)
- BLS/ACLS certifications (2-year cycles)
- Specialty certifications (varies by certification)
- Background checks (annual or biennial)
- Health screenings (annual)

Automated alerts notify compliance staff before expiration so renewals can be completed before staff become non-compliant.

Training Management:
Track required training:
Initial orientation:
- Facility policies and procedures
- Patient rights and HIPAA
- Infection control
- Fire safety and emergency procedures
- Workplace safety and OSHA

Annual training:
- Infection control
- Fire safety and evacuation
- Emergency preparedness
- HIPAA compliance
- Workplace violence prevention
- Harassment prevention

Role-specific training:
- Nursing continuing education (state requirements vary)
- Surgical tech specialty training
- Sterile processing updates
- Medication administration competencies
- Equipment-specific training

Competency Assessments:
Track initial and annual competencies:
- Clinical skills validation
- Equipment operation
- Emergency response
- Documentation requirements
- Specialty procedures

Compliance by Role:
Different roles have different requirements:
Registered Nurses:
- State RN license
- BLS certification required, ACLS may be required
- Continuing education per state requirements (e.g., 20 hours per 2 years in Texas)
- Specialty certifications (CNOR, CAPA)

Surgical Technologists:
- Certification (CST or NCCT)
- BLS certification
- Sterile processing knowledge
- Specialty training

Administrative Staff:
- Background checks
- HIPAA training
- Role-specific training
- No clinical licenses typically required

Staff Compliance Dashboard:
View compliance status:
- Staff members with expiring credentials (by timeframe)
- Incomplete training requirements
- Overdue competency assessments
- Staff compliance percentage by role or location
- New hire onboarding status

Multi-Location Staffing:
For staff working at multiple facilities:
- Track which locations each staff member is assigned to
- Monitor location-specific training and competencies
- Ensure compliance requirements met for all assigned locations

Reporting:
Generate reports:
- Staff roster with compliance status
- Expiring licenses and certifications
- Training completion rates
- Competency assessment status
- Non-compliant staff requiring follow-up

Onboarding Checklist:
For new hires, track onboarding requirements:
- Background check completed
- License verification
- Certification verification
- Orientation training completed
- Initial competency assessments
- Facility-specific training
- System access granted
- Employee handbook acknowledgment

Pilot Limitations:
The pilot allows manual upload and tracking of staff documents. The full platform adds automated monitoring, license verification with state boards, training completion workflows, and enterprise-wide staff compliance coordination across multiple locations.`,
    category: "Staff",
  },
  {
    id: "document-management",
    title: "Document Management",
    content: `Document management in CareLumi provides centralized storage, expiration tracking, version control, and completeness monitoring for all compliance documents.

Document Repository:
CareLumi serves as a single source of truth for:
- Provider documents (licenses, certifications, insurance, privileges)
- Facility documents (licenses, accreditation, inspections, policies)
- Staff documents (licenses, certifications, training records)
- Payer documents (contracts, participation agreements, credentialing materials)
- Policies and procedures (operational manuals, regulatory policies)

Document Upload:
Upload documents via:
- Drag-and-drop interface
- File browser selection
- Bulk upload for multiple documents
- Email forwarding to document portal (full platform feature)

Supported file types:
- PDF documents
- Images (JPG, PNG)
- Microsoft Word/Excel
- Scanned documents

Document Organization:
Documents are automatically organized by:
- Owner: provider, facility, staff member, payer
- Type: license, certification, insurance, contract, policy, inspection report
- Category: credentialing, compliance, accreditation, training
- Location: specific facility or enterprise-wide
- Status: current, expiring soon, expired, pending renewal

Each document includes metadata:
- Document name
- Document type
- Owner/associated entity
- Issue date
- Expiration date (if applicable)
- Upload date
- Uploaded by (user)
- Notes or comments
- Version (if multiple versions exist)

Expiration Tracking:
For documents with expiration dates:
- Expiration date entered during upload or extracted automatically
- Document status calculated: current, expiring in 90/60/30/7 days, expired
- Alerts triggered based on expiration timeline
- Dashboard displays documents by expiration status

Version Control:
When documents are updated:
- New version uploaded
- Previous version archived but accessible
- Version history maintained with dates
- Ability to view or download previous versions
- Audit trail of who uploaded each version

Document Completeness:
CareLumi tracks document completeness:
- Required documents defined by entity type (provider, facility, staff)
- Completion percentage calculated
- Missing documents flagged
- Incomplete profiles highlighted on dashboard

For example, a provider profile may require:
- State medical license
- Board certification
- DEA registration
- Malpractice insurance
- BLS certification

If 4 of 5 documents are uploaded, completeness is 80%, and the missing DEA registration is flagged.

Document Search and Retrieval:
Find documents quickly:
- Search by document name, type, owner, or keywords
- Filter by status (current, expiring, expired)
- Filter by location or category
- Sort by expiration date, upload date, or name

Access Control:
Control who can view or upload documents:
- Role-based permissions (administrators, compliance officers, facility managers)
- Location-based access (staff see only their assigned locations)
- Provider self-service (providers upload their own documents, if enabled)

Document Alerts:
Automated notifications:
- Email or in-app alerts for expiring documents
- Escalating reminders as expiration approaches
- Alerts for missing required documents
- Notifications when documents are uploaded or updated

Renewal Workflows:
Track document renewal process:
- Identify documents needing renewal
- Assign renewal task to responsible person
- Track renewal application submission
- Upload renewed document
- Verify new expiration date
- Archive old version

Document Audit Trail:
Maintain history:
- Who uploaded each document
- When document was uploaded
- Changes to expiration dates or metadata
- Downloads or views (full platform feature)
- Deletions or archival

Policy and Procedure Management:
Specialized features for policies:
- Policy library organized by category (clinical, administrative, safety)
- Version control with revision dates
- Distribution tracking (which staff have reviewed)
- Acknowledgment tracking (staff sign-off)
- Scheduled policy review reminders
- Policy alignment with regulatory requirements

Bulk Operations:
Manage multiple documents efficiently:
- Bulk upload of similar documents
- Batch expiration date updates
- Bulk tagging or categorization
- Mass notifications for specific document types

Document Reports:
Generate reports:
- All documents by expiration date
- Missing documents by provider/facility/staff
- Uploaded documents by date range
- Document completeness summary
- Version history reports

Pilot Limitations:
The pilot allows document upload, organization, and manual expiration tracking. The full platform adds automated expiration monitoring with alerts, optical character recognition (OCR) to extract dates from uploaded documents, email forwarding to upload documents, and integration with provider/facility/payer portals for automatic document retrieval.`,
    category: "Documents",
  },
  {
    id: "audit-readiness",
    title: "Audit Readiness",
    content: `Audit readiness in CareLumi helps organizations prepare for inspections, surveys, and accreditation visits by identifying compliance gaps and providing readiness workflows.

Compliance Scoring:
CareLumi calculates compliance scores:
- Provider compliance: percentage of providers with complete, current credentials
- Facility compliance: percentage of facility documents current and complete
- Staff compliance: percentage of staff with licenses, certifications, and training up to date
- Overall organizational compliance: weighted average across all areas

Scores are displayed on dashboard and updated in real-time as documents are uploaded or expire.

Gap Identification:
The platform identifies specific gaps:
- Expired or expiring documents
- Missing required documents
- Incomplete credentialing files
- Overdue training
- Incomplete competency assessments
- Policies due for review

Gaps are prioritized by:
- Urgency: expired vs. expiring soon vs. missing
- Impact: critical documents (licenses) vs. supporting documents (training certificates)
- Entity: which provider, facility, or staff member is affected

Readiness Checklists:
For upcoming inspections or surveys, generate checklists:
- Document review: verify all required documents current and accessible
- Staff credential verification: ensure all staff have valid licenses and certifications
- Policy review: confirm policies updated and distributed
- Equipment checks: verify maintenance logs and emergency equipment (if applicable)
- Facility walkthrough: identify physical plant issues
- Mock survey: conduct internal audit using regulatory standards

Inspection Preparation Workflow:
When an inspection is scheduled:
1. Set inspection date in CareLumi
2. Generate readiness checklist based on regulatory requirements
3. Assign checklist items to responsible staff
4. Track completion of each item
5. Upload corrective actions or updated documents
6. Conduct mock survey to identify remaining gaps
7. Final readiness review before survey date

Survey Findings Management:
After an inspection:
- Upload survey report
- Extract deficiency findings
- Categorize findings by severity and area
- Assign corrective actions to responsible staff
- Set deadlines for Plan of Correction submission
- Track implementation of corrections
- Upload evidence of compliance
- Prepare for follow-up survey if required

Common Deficiency Areas:
CareLumi helps address common survey findings:
- Incomplete medical staff credential files: track provider licenses, DEA, insurance, privileges
- Expired staff licenses or certifications: automated alerts prevent expiration
- Outdated policies and procedures: policy review reminders and version control
- Missing training documentation: centralized training record tracking
- Equipment maintenance gaps: document upload for maintenance logs
- Infection control lapses: policy and training documentation

Accreditation Preparation:
For accreditation surveys (AAAHC, ACHC, Joint Commission):
- Track accreditation cycle (typically 3 years)
- Review accreditation standards and documentation requirements
- Ensure all policies align with accrediting body standards
- Verify staff credentials and training
- Prepare for tracer methodology (following patient through care process)
- Organize documents for easy access during on-site survey

Corrective Action Plans:
When gaps are identified:
- Document the specific gap or deficiency
- Identify root cause
- Define corrective action
- Assign responsibility
- Set completion deadline
- Implement correction
- Verify effectiveness
- Upload evidence of compliance

Audit Trail:
Maintain documentation of compliance efforts:
- History of document uploads and updates
- Training completion records
- Policy acknowledgments
- Corrective actions and completion dates
- Survey reports and Plans of Correction

This audit trail demonstrates ongoing compliance efforts to surveyors and accreditors.

Continuous Compliance Monitoring:
Rather than scrambling before inspections:
- Monitor compliance continuously via dashboard
- Address gaps as they arise
- Maintain documents current through automated alerts
- Conduct periodic internal audits
- Keep compliance scores above target thresholds

This proactive approach ensures survey readiness at all times.

Reporting for Leadership:
Generate compliance reports:
- Executive summary of organizational compliance status
- Compliance trends over time
- Gap analysis by location or department
- Comparison across facilities (for multi-site organizations)
- Deficiency resolution status

These reports keep leadership informed and demonstrate compliance to governing bodies and stakeholders.

Pilot Limitations:
The pilot allows organizing documents and manually reviewing compliance status. The full platform adds automated compliance scoring, gap identification workflows, survey preparation tools, corrective action tracking, and regulatory-standard-specific checklists for different accrediting bodies and state requirements.`,
    category: "Compliance",
  },
  {
    id: "multi-state-pilot",
    title: "Multi-State Operations - Pilot Trial Q&A",
    content: `This document answers common questions about using CareLumi's pilot trial for multi-state healthcare operations.

Q1: Tracking Provider Licenses Across Multiple States

What the trial can show:
- Upload provider documents (licenses, certifications, DEA, insurance) and see how CareLumi organizes them in a clean, centralized view
- The trial shows expiration tracking, renewal alerts, and how multiple state licenses appear in one provider profile
- Test how the platform visually distinguishes licenses, documents, and renewal timelines—especially useful for clinicians practicing in multiple states

Trial limitations:
- The trial does not connect to state licensing boards
- Expiration reminders and status indicators are based entirely on the documents you upload
- Any supervision requirements or scope-of-practice patterns are shown at a generalized, non-state-specific level

What the full platform unlocks:
- Automated monitoring across all states where your providers practice
- Centralized renewal workflows, reminders, and document completeness checks
- Enterprise-wide visibility across multi-state clinical teams, without maintaining spreadsheets

Q2: Handling Multi-State Facilities (ASCs, Outpatient Clinics, Surgery Centers)

What the trial can show:
- Create multiple facilities, upload facility-specific documents (licenses, accreditation, insurance, compliance policies), and see how the platform keeps each location organized
- Try assigning documents to specific locations to simulate operations in different states
- The trial shows how enterprise-wide policies and location-specific documents co-exist in the same platform

Trial limitations:
- The trial does not show state schedules, inspection timelines, or accreditation reminders
- No automated state-specific compliance checklists
- No real regulatory calendars or integration with survey agencies

What the full platform unlocks:
- State-aware facility tracking (license cycles, inspection readiness workflows)
- Enterprise-wide accreditation tracking
- Unified visibility across all locations regardless of state

Q3: Payer Credentialing Support (Medicare, Medicaid, Commercial Plans)

What the trial can show:
- Upload payer contracts and document which providers or facilities participate in which networks
- Model provider-by-payer status using uploaded documents
- Explore how payer data is organized alongside provider and facility records

Trial limitations:
- No live PECOS, Medicaid, or MCO integrations
- No real credentialing submissions or status updates
- No payer-specific processing timelines, forms, or workflows

What the full platform unlocks:
- Centralized tracking of provider and facility credentialing steps
- High-level credentialing workflows that help coordinate Medicare/Medicaid/commercial contracting
- Enterprise visibility into payer participation across multiple states and facilities

Q4: Using Trial Data After Upgrade

How trial data is used:
- Any documents or records you upload during the trial become your base dataset when you upgrade
- They form the foundation of your centralized credentialing, facility, and payer tracking system

What happens during upgrade:
- Your trial data is reviewed, standardized, and migrated into the full platform
- Missing or inconsistent information is flagged for your team to resolve during onboarding

What becomes available after upgrade:
- Automated monitoring of expirations, renewals, and document completeness
- Active workflows and alerts triggered by upcoming deadlines
- Multi-state coordination across provider, facility, and payer requirements

Q5: Facility & Accreditation Readiness

What the trial can show:
- Upload sample survey findings, accreditation letters, or readiness materials
- Test how the platform organizes corrective actions, facility-level documents, and version-controlled policies
- Simulate mock survey preparation workflows

Trial limitations:
- No real accreditation calendars or regulatory due dates
- No automated readiness assessments or state-specific survey protocols

What the full platform unlocks:
- Centralized accreditation tracking across all facilities
- Automated reminders for renewals and survey cycles
- Policy-to-facility alignment across multi-state organizations

Q6: Planning Multi-State Expansion

What the trial can show:
- Create a new facility profile to simulate opening a new location in another state
- Test how provider licenses, facility documents, and payer participation would need to be tracked for expansion
- Explore how policies can be shared across locations with state-specific addenda

Trial limitations:
- No state-specific timelines, forms, or fees
- No automated regulatory requirement checklists
- No sequencing of licensing, credentialing, or payer contracting steps

What the full platform unlocks:
- Structured project workflows for new facilities
- State-aware tracking of licensing, credentialing, and operational readiness
- Enterprise replication of policies and scalable multi-state operations infrastructure

Q7: Will Clip Use Our Real Data in the Trial?

Trial Clip behavior:
- Clip can answer high-level questions about compliance concepts, how CareLumi works, and general multi-state patterns
- Clip cannot see your uploaded documents or records during the trial
- Clip uses the knowledge base you provide (the KB docs you uploaded) plus your questions

Trial limitations:
- Clip cannot access any live provider, facility, or payer data
- Clip cannot see expiration dates, documents, or your dashboard
- Clip does not execute detailed, state-specific regulatory logic in the trial

After upgrade:
- Clip becomes a unified intelligence layer across all locations, providers, facilities, payers, and compliance workflows
- Clip can answer operational questions using your production environment data
- Clip can surface trends, alerts, and actions at the multi-state enterprise level

Q8: What Should We Focus On During Pilot to Prepare for Scaling?

Recommended trial focus:
- Upload representative provider and facility documents across states
- Test how CareLumi organizes multi-state complexity (providers practicing in multiple states, facilities with different regulatory documents)
- Evaluate whether your teams (credentialing, compliance, facility admins) can find what they need easily
- Test mock workflows (renewals, survey prep, document uploads)

Why this matters:
- The trial validates whether the platform handles your specific operational reality
- Your findings help define your implementation plan for enterprise rollout

After upgrade:
- Everything uploaded becomes part of your production dataset
- Automated monitoring, alerts, and workflows begin running
- Your multi-state operations become coordinated through one centralized platform`,
    category: "Pilot",
  },
]

// Simple text similarity function using word overlap
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().match(/\b\w+\b/g) || []
  const words2 = text2.toLowerCase().match(/\b\w+\b/g) || []

  const set1 = new Set(words1)
  const set2 = new Set(words2)

  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])

  return intersection.size / union.size
}

// Chunk text into paragraphs for better matching
function chunkText(text: string): string[] {
  return text.split("\n\n").filter((chunk) => chunk.trim().length > 0)
}

// Search knowledge base for relevant content
export function searchKnowledgeBase(query: string, topK = 3): SearchResult[] {
  const results: SearchResult[] = []

  for (const doc of knowledgeBase) {
    const chunks = chunkText(doc.content)
    const chunkScores = chunks.map((chunk) => ({
      chunk,
      score: calculateSimilarity(query, chunk),
    }))

    // Sort chunks by relevance
    chunkScores.sort((a, b) => b.score - a.score)

    // Calculate document relevance from top chunks
    const topChunks = chunkScores.slice(0, 3)
    const relevance = topChunks.reduce((sum, { score }) => sum + score, 0) / topChunks.length

    // Also check title similarity
    const titleSimilarity = calculateSimilarity(query, doc.title)
    const finalRelevance = Math.max(relevance, titleSimilarity * 0.8)

    if (finalRelevance > 0.05) {
      // Minimum threshold
      results.push({
        document: doc,
        relevance: finalRelevance,
        matchedChunks: topChunks.map(({ chunk }) => chunk),
      })
    }
  }

  // Sort by relevance and return top K
  results.sort((a, b) => b.relevance - a.relevance)
  return results.slice(0, topK)
}

// Build context string from search results
export function buildContext(results: SearchResult[]): string {
  if (results.length === 0) {
    return "No relevant information found in the knowledge base."
  }

  let context = "Relevant information from CareLumi knowledge base:\n\n"

  for (const result of results) {
    context += `From "${result.document.title}" (${result.document.category}):\n`
    context += result.matchedChunks.slice(0, 2).join("\n\n")
    context += "\n\n---\n\n"
  }

  return context
}
