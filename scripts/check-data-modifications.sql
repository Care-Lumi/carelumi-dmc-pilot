-- Check for any modifications to existing data
-- This identifies records that have been updated after initial creation

SELECT 
  'documents' as table_name,
  id,
  original_filename as name,
  created_at,
  updated_at,
  (updated_at - created_at) as time_since_creation,
  CASE 
    WHEN updated_at > created_at + INTERVAL '1 minute' THEN 'Modified'
    ELSE 'Unchanged'
  END as modification_status
FROM documents
WHERE org_id = ${process.env.DMC_ORG_ID}
  AND updated_at > created_at + INTERVAL '1 minute'
ORDER BY updated_at DESC
LIMIT 20;
