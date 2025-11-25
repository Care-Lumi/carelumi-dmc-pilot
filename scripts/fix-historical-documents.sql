-- Fix historical document status for Anitra Willis-Hopkins
-- This document expired in 2023 but was incorrectly marked as "active"

UPDATE documents
SET status = 'historical'
WHERE license_number = '056.015580'
  AND owner_name = 'Anitra Willis-Hopkins'
  AND expiration_date < NOW()
  AND status = 'active';

-- Verify the update
SELECT 
  id,
  file_name,
  owner_name,
  license_number,
  expiration_date,
  status,
  created_at
FROM documents
WHERE license_number = '056.015580'
  AND owner_name = 'Anitra Willis-Hopkins'
ORDER BY expiration_date DESC;
