/**
 * Domain types for Rafion AI Platform
 * Institutional-grade type definitions with full auditability
 */

export type PendingDraftStatus = 'pending_review' | 'approved' | 'rejected' | 'archived';

export type InvestmentType = 'acquisition' | 'growth_equity' | 'lbo' | 'minority' | 'other';

/**
 * PendingDraft - Represents an AI-generated investment analysis awaiting human review
 * Enforces human-in-the-loop workflow: AI drafts must be reviewed before final commitment
 */
export interface PendingDraft {
  id: string;
  user_id: string; // Foreign key to auth.users
  firm_id: string; // Multi-tenancy: isolate data by firm (RLS enforced)
  
  // Draft Content
  deal_title: string;
  investment_type: InvestmentType;
  
  // AI-Generated Analysis
  executive_summary: string;
  valuation_analysis: {
    estimated_valuation: number;
    valuation_method: string;
    confidence_score: number; // 0-100, displayed to user
  };
  risk_assessment: string;
  strategic_fit_score: number; // 0-100
  
  // Human-in-the-Loop Status
  status: PendingDraftStatus;
  reviewer_id?: string; // User who approved/rejected (for auditability)
  review_timestamp?: string;
  review_notes?: string;
  
  // Audit Trail
  created_at: string;
  updated_at: string;
  created_by_model_version: string; // Track which AI model version created this
  
  // Source Data References
  source_document_ids: string[];
  rag_context_used: {
    total_documents_queried: number;
    top_sources: string[];
  };
}

export interface DashboardState {
  drafts: PendingDraft[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  pageNumber: number;
}

export interface FetchDraftsResult {
  success: boolean;
  data?: PendingDraft[];
  error?: string;
  count?: number;
}
