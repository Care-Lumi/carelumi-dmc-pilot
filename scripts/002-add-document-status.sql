-- Add status column to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Set all existing documents to 'active'
UPDATE documents SET status = 'active' WHERE status IS NULL;

-- Add owner_normalized for case-insensitive matching
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS owner_normalized TEXT;

-- Populate owner_normalized for existing rows
UPDATE documents 
SET owner_normalized = LOWER(REGEXP_REPLACE(owner_name, '[^a-zA-Z0-9]', '', 'g'))
WHERE owner_name IS NOT NULL;

-- Create index for normalized owner matching
CREATE INDEX IF NOT EXISTS idx_documents_owner_normalized ON documents(owner_normalized);
