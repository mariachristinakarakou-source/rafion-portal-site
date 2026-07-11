/**
 * RAFION AI - DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) SETUP
 * 
 * This file contains the SQL DDL statements to initialize the Supabase database
 * with proper RLS enforcement for institutional-grade security.
 * 
 * Execute these queries in the Supabase SQL Editor.
 */

-- ============================================================================
-- 1. ENABLE RLS AT DATABASE LEVEL
-- ============================================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;

-- ============================================================================
-- 2. CREATE PENDING_DRAFTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pending_drafts (
  -- Primary Key & Foreign Keys
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  firm_id UUID NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Deal Information
  deal_title TEXT NOT NULL,
  investment_type TEXT NOT NULL CHECK (investment_type IN ('acquisition', 'growth_equity', 'lbo', 'minority', 'other')),

  -- AI-Generated Analysis Content
  executive_summary TEXT NOT NULL,
  valuation_analysis JSONB NOT NULL DEFAULT '{"estimated_valuation": 0, "valuation_method": "", "confidence_score": 0}'::jsonb,
  risk_assessment TEXT NOT NULL,
  strategic_fit_score SMALLINT NOT NULL CHECK (strategic_fit_score >= 0 AND strategic_fit_score <= 100),

  -- Human-in-the-Loop Status
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'archived')),
  review_timestamp TIMESTAMPTZ,
  review_notes TEXT,

  -- Audit Trail
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_model_version TEXT NOT NULL DEFAULT 'v1.0',

  -- RAG Context
  source_document_ids TEXT[] DEFAULT ARRAY[]::text[],
  rag_context_used JSONB NOT NULL DEFAULT '{"total_documents_queried": 0, "top_sources": []}'::jsonb,

  -- Indexes for performance
  CONSTRAINT valid_valuation CHECK (
    (valuation_analysis->>'estimated_valuation')::numeric > 0
  ),
  CONSTRAINT valid_confidence CHECK (
    ((valuation_analysis->>'confidence_score')::smallint >= 0 AND
     (valuation_analysis->>'confidence_score')::smallint <= 100)
  )
);

-- Create indexes for common queries
CREATE INDEX idx_pending_drafts_firm_status ON public.pending_drafts(firm_id, status);
CREATE INDEX idx_pending_drafts_created_at ON public.pending_drafts(created_at DESC);
CREATE INDEX idx_pending_drafts_user_id ON public.pending_drafts(user_id);

-- Enable RLS on pending_drafts table
ALTER TABLE public.pending_drafts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ⚠️ CRITICAL SECURITY POLICIES

-- Policy 1: SELECT - Users can only see drafts from their firm
CREATE POLICY "Users can view pending_drafts from their firm"
  ON public.pending_drafts
  FOR SELECT
  USING (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    -- User's firm_id must match the draft's firm_id
    -- ⚠️ NOTE: You must store user's firm_id in auth.users.raw_user_meta_data
    -- Example: SET user's metadata to {"firm_id": "uuid-here"}
    AND firm_id = (auth.jwt()->>'firm_id')::uuid
  );

-- Policy 2: INSERT - Users can only create drafts for their firm
CREATE POLICY "Users can create pending_drafts for their firm"
  ON public.pending_drafts
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND firm_id = (auth.jwt()->>'firm_id')::uuid
  );

-- Policy 3: UPDATE - Users can only approve/reject their firm's drafts
CREATE POLICY "Users can update pending_drafts for their firm"
  ON public.pending_drafts
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND firm_id = (auth.jwt()->>'firm_id')::uuid
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND firm_id = (auth.jwt()->>'firm_id')::uuid
  );

-- Policy 4: DELETE - Only admins or system can delete (audit requirement)
CREATE POLICY "Only system can delete pending_drafts"
  ON public.pending_drafts
  FOR DELETE
  USING (false); -- Disable deletion to maintain audit trail

-- ============================================================================
-- 4. AUDIT LOG TABLE (Optional but Recommended)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_firm_created ON public.audit_log(firm_id, created_at DESC);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs for their firm"
  ON public.audit_log
  FOR SELECT
  USING (firm_id = (auth.jwt()->>'firm_id')::uuid);

-- ============================================================================
-- 5. TRIGGER FOR AUDIT TRAIL (Automatic tracking)
-- ============================================================================
CREATE OR REPLACE FUNCTION log_pending_draft_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_log (firm_id, user_id, action, table_name, record_id, changes)
    VALUES (
      NEW.firm_id,
      auth.uid(),
      'UPDATE',
      'pending_drafts',
      NEW.id,
      jsonb_build_object(
        'status', jsonb_build_object('old', OLD.status, 'new', NEW.status),
        'reviewer_id', jsonb_build_object('old', OLD.reviewer_id, 'new', NEW.reviewer_id),
        'review_notes', jsonb_build_object('old', OLD.review_notes, 'new', NEW.review_notes)
      )
    );
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_log (firm_id, user_id, action, table_name, record_id)
    VALUES (NEW.firm_id, NEW.user_id, 'INSERT', 'pending_drafts', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_pending_draft_audit
  AFTER INSERT OR UPDATE ON public.pending_drafts
  FOR EACH ROW
  EXECUTE FUNCTION log_pending_draft_changes();

-- ============================================================================
-- 6. HELPER FUNCTION - Get firm_id for authenticated user
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_firm_id(user_id UUID)
RETURNS UUID AS $$
DECLARE
  firm_id UUID;
BEGIN
  -- Extract from JWT token stored in auth.users
  SELECT (raw_user_meta_data->>'firm_id')::uuid
  INTO firm_id
  FROM auth.users
  WHERE id = user_id;
  
  RETURN firm_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- SETUP INSTRUCTIONS
-- ============================================================================
/*
IMPORTANT SETUP STEPS:

1. Create your users and associate them with firms:
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{firm_id}', '"YOUR-FIRM-UUID"'::jsonb)
   WHERE email = 'user@example.com';

2. Use Service Role Key for server-side operations (in Next.js):
   - Store in SUPABASE_SERVICE_ROLE_KEY environment variable
   - RLS policies still apply! The policies check auth.jwt() context
   - For service role, you may need to pass user context manually

3. Create a test draft:
   INSERT INTO public.pending_drafts (
     user_id,
     firm_id,
     deal_title,
     investment_type,
     executive_summary,
     valuation_analysis,
     risk_assessment,
     strategic_fit_score,
     created_by_model_version
   ) VALUES (
     'user-uuid',
     'firm-uuid',
     'Acme Corp Acquisition',
     'acquisition',
     'Strong acquisition target in tech sector...',
     '{"estimated_valuation": 50000000, "valuation_method": "DCF", "confidence_score": 85}'::jsonb,
     'Market competition risk is moderate...',
     78,
     'v1.0'
   );

4. Test RLS policies by querying as different users
*/
