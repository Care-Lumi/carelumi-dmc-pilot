-- Check the most recent documents uploaded
-- This shows the last 10 documents created to see if customer has uploaded anything new

SELECT 
  id,
  original_filename,
  doc_type,
  owner_name,
  created_at,
  updated_at,
  status,
  CASE 
    WHEN created_at > NOW() - INTERVAL '1 hour' THEN 'Just now'
    WHEN created_at > NOW() - INTERVAL '24 hours' THEN 'Today'
    WHEN created_at > NOW() - INTERVAL '7 days' THEN 'This week'
    ELSE 'Older'
  END as recency
FROM documents
WHERE org_id = ${process.env.DMC_ORG_ID}
ORDER BY created_at DESC
LIMIT 10;
