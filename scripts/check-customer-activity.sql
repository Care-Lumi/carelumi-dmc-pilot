-- Check Customer Activity Report
-- Run this script to see if your customer has made any changes to the production database
-- This will show you the most recent activity across all tables

-- 1. Check if any documents have been uploaded by the customer
SELECT 
  'documents' as table_name,
  COUNT(*) as total_records,
  MAX(created_at) as last_created,
  MAX(updated_at) as last_updated,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as created_last_24h,
  COUNT(CASE WHEN updated_at > NOW() - INTERVAL '24 hours' THEN 1 END) as updated_last_24h
FROM documents
WHERE org_id = ${process.env.DMC_ORG_ID}

UNION ALL

-- 2. Check if any staff members have been added or modified
SELECT 
  'staff' as table_name,
  COUNT(*) as total_records,
  MAX(created_at) as last_created,
  MAX(updated_at) as last_updated,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as created_last_24h,
  COUNT(CASE WHEN updated_at > NOW() - INTERVAL '24 hours' THEN 1 END) as updated_last_24h
FROM staff
WHERE org_id = ${process.env.DMC_ORG_ID}

UNION ALL

-- 3. Check if any facilities have been added or modified
SELECT 
  'facilities' as table_name,
  COUNT(*) as total_records,
  MAX(created_at) as last_created,
  MAX(updated_at) as last_updated,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as created_last_24h,
  COUNT(CASE WHEN updated_at > NOW() - INTERVAL '24 hours' THEN 1 END) as updated_last_24h
FROM facilities
WHERE org_id = ${process.env.DMC_ORG_ID}

UNION ALL

-- 4. Check if any payers have been added or modified
SELECT 
  'payers' as table_name,
  COUNT(*) as total_records,
  MAX(created_at) as last_created,
  MAX(updated_at) as last_updated,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as created_last_24h,
  COUNT(CASE WHEN updated_at > NOW() - INTERVAL '24 hours' THEN 1 END) as updated_last_24h
FROM payers
WHERE org_id = ${process.env.DMC_ORG_ID}

ORDER BY last_updated DESC;
