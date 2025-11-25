-- Phase 2: Tracking & Metrics Tables
-- Created for CareLumi pilot alpha tracking

-- 1. Sessions: Track user visits and time spent
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_org_id ON sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);

-- 2. Page Views: Track navigation between pages
CREATE TABLE IF NOT EXISTS page_view_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  referrer TEXT,
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_view_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_org_id ON page_view_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_view_logs(viewed_at);

-- 3. Click Events: Track specific button clicks
CREATE TABLE IF NOT EXISTS click_event_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_path TEXT NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_click_events_session ON click_event_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_click_events_org_id ON click_event_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_click_events_event_name ON click_event_logs(event_name);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON click_event_logs(clicked_at);

-- 4. AI Usage Logs: Track AI API calls with cost
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  feature TEXT NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  called_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_session ON ai_usage_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_org_id ON ai_usage_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_provider ON ai_usage_logs(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_called_at ON ai_usage_logs(called_at);

-- 5. Document Classifications: Track classification attempts
CREATE TABLE IF NOT EXISTS document_classification_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size_kb INTEGER NOT NULL,
  primary_provider TEXT NOT NULL,
  fallback_providers TEXT[],
  classification_result JSONB,
  total_time_ms INTEGER NOT NULL,
  classified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_doc_classifications_session ON document_classification_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_doc_classifications_org_id ON document_classification_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_doc_classifications_classified_at ON document_classification_logs(classified_at);

-- 6. Chat Conversations: Track Clip AI chat interactions
CREATE TABLE IF NOT EXISTS chat_conversation_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_conversation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_org_id ON chat_conversation_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_conversation_logs(created_at);

-- Grant necessary permissions (adjust for your database user if needed)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO carelumi_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO carelumi_user;
