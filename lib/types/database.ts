export interface Organization {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  org_id: string
  file_url: string
  original_filename: string
  doc_type: string
  owner_type: "staff" | "facility" | "payer" | "organization"
  owner_name: string | null
  jurisdiction: string | null
  license_number: string | null
  expires_at: string | null
  classification_raw: any
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  org_id: string
  name: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Facility {
  id: string
  org_id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Payer {
  id: string
  org_id: string
  name: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}
