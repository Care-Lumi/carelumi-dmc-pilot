-- Phase 1: Core schema for DMC Pilot
-- Creates tables for organizations, documents, staff, facilities, and payers

-- Organizations table (multi-org design, single hardcoded row for pilot)
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert DMC Inc (pilot organization)
INSERT INTO organizations (id, name) 
VALUES ('dmc-inc', 'DMC Inc')
ON CONFLICT (id) DO NOTHING;

-- Documents table (central source of truth for all uploaded files)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL, -- Vercel Blob URL
  original_filename TEXT NOT NULL,
  doc_type TEXT NOT NULL, -- 'medical_license', 'dea_certificate', 'facility_license', 'payer_contract', etc.
  owner_type TEXT NOT NULL, -- 'staff', 'facility', 'payer', 'organization'
  owner_name TEXT, -- extracted person/entity name
  jurisdiction TEXT, -- state/jurisdiction
  license_number TEXT, -- extracted license/cert number
  expires_at TIMESTAMPTZ, -- expiration date
  classification_raw JSONB, -- Gemini's raw response for audit trail
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_documents_org_id ON documents(org_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner_type ON documents(owner_type);
CREATE INDEX IF NOT EXISTS idx_documents_expires_at ON documents(expires_at);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Staff table (derived from documents with owner_type='staff')
-- This is a materialized view essentially - we'll populate it from documents
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, name)
);

CREATE INDEX IF NOT EXISTS idx_staff_org_id ON staff(org_id);

-- Facilities table (derived from documents with owner_type='facility')
CREATE TABLE IF NOT EXISTS facilities (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, name)
);

CREATE INDEX IF NOT EXISTS idx_facilities_org_id ON facilities(org_id);

-- Payers table (derived from documents with owner_type='payer')
CREATE TABLE IF NOT EXISTS payers (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, name)
);

CREATE INDEX IF NOT EXISTS idx_payers_org_id ON payers(org_id);
