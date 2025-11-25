-- Create organizations table for storing editable settings
-- This is NOT used for authentication (auth uses cookies + in-memory config)
-- This table only stores contact information that can be edited in settings

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-populate with the 3 pilot organizations
INSERT INTO organizations (id, name, primary_contact_name, primary_contact_email)
VALUES 
  ('dmc-inc', 'DMC Inc Surgery Centers', 'John Cavanagh', 'jcavanagh@dmc-inc.com'),
  ('kemit-academy', 'Kemit Academy Pediatric Therapy', 'Kiley Russell', 'kiley@kemitacademy.com'),
  ('anda-therapy', 'Anda Therapy Group', 'Martin Beck', 'info@andatherapygroup.com')
ON CONFLICT (id) DO NOTHING;
