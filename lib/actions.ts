'use server';

/**
 * Server Actions for Pending Drafts
 * All database operations run server-side with authenticated user context
 * and row-level authorization based on the user's firm.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { PendingDraft, FetchDraftsResult } from './types';

const DraftInputSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  firm_id: z.string().uuid(),
  deal_title: z.string().min(1),
  investment_type: z.enum(['acquisition', 'growth_equity', 'lbo', 'minority', 'other']),
  executive_summary: z.string().min(1),
  valuation_analysis: z.object({
    estimated_valuation: z.number().nonnegative(),
    valuation_method: z.string().min(1),
    confidence_score: z.number().min(0).max(100),
  }),
  risk_assessment: z.string().min(1),
  strategic_fit_score: z.number().min(0).max(100),
  status: z.enum(['pending_review', 'approved', 'rejected', 'archived']).default('pending_review'),
  reviewer_id: z.string().uuid().optional(),
  review_timestamp: z.string().optional(),
  review_notes: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by_model_version: z.string().min(1),
  source_document_ids: z.array(z.string()),
  rag_context_used: z.object({
    total_documents_queried: z.number().int().nonnegative(),
    top_sources: z.array(z.string()),
  }),
});

export type DraftInput = z.infer<typeof DraftInputSchema>;

const PendingDraftSchema = DraftInputSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type PendingDraftSchemaType = z.infer<typeof PendingDraftSchema>;

const getSupabaseServerClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing server-side Supabase credentials');
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
};

async function validateSession(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>
): Promise<{ userId: string; firmId: string; email: string | null }> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Authentication required');
  }

  const firmId = session.user.user_metadata?.firm_id as string | undefined;

  if (!firmId) {
    throw new Error('User firm metadata is missing');
  }

  return {
    userId: session.user.id,
    firmId,
    email: session.user.email ?? null,
  };
}

/**
 * Fetch pending drafts for the authenticated user's firm
 *
 * @param userId - Authenticated user ID
 * @param firmId - Firm ID for multi-tenant isolation
 * @param pageSize - Number of drafts per page (default: 10)
 * @param pageNumber - Page number for pagination (default: 0)
 * @returns FetchDraftsResult with drafts or error
 *
 * Security Notes:
 * - RLS policy on pending_drafts table ensures users only see drafts from their firm
 * - Pagination prevents DoS via excessive data requests
 * - All queries are audited via Supabase audit logs
 */
export async function fetchPendingDrafts(
  userId?: string,
  firmId?: string,
  pageSize: number = 10,
  pageNumber: number = 0,
  search?: string,
  status?: string
): Promise<FetchDraftsResult> {
  try {
    const supabase = await getSupabaseServerClient();
    const session = await validateSession(supabase);

    if (userId && userId !== session.userId) {
      return {
        success: false,
        error: 'Session user mismatch',
      };
    }

    if (firmId && firmId !== session.firmId) {
      return {
        success: false,
        error: 'Session firm mismatch',
      };
    }

    let query: any = supabase
      .from('pending_drafts')
      .select(
        `
        id, 
        user_id, 
        firm_id, 
        deal_title, 
        investment_type, 
        executive_summary, 
        valuation_analysis,
        risk_assessment, 
        strategic_fit_score, 
        status, 
        reviewer_id, 
        review_timestamp, 
        review_notes, 
        created_at, 
        updated_at,
        created_by_model_version,
        source_document_ids,
        rag_context_used
        `,
        { count: 'exact' }
      )
      .eq('firm_id', session.firmId)
      .order('created_at', { ascending: false });

    // Apply status filter if provided, else default to pending_review
    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'pending_review');
    }

    // Apply search filter on deal_title (case-insensitive)
    if (search && search.trim().length > 0) {
      const term = `%${search.trim()}%`;
      query = query.ilike('deal_title', term);
    }

    query = query.range(pageNumber * pageSize, (pageNumber + 1) * pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error.message);
      return {
        success: false,
        error: `Failed to fetch pending drafts: ${error.message}`,
      };
    }

    return {
      success: true,
      data: (data as PendingDraft[]) || [],
      count: count || 0,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Unexpected error in fetchPendingDrafts:', errorMessage);
    return {
      success: false,
      error: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}

function validateDraftInput(
  draft: unknown
): { success: true; data: DraftInput } | { success: false; error: string } {
  const result = DraftInputSchema.safeParse(draft);

  if (!result.success) {
    const errors = result.error.flatten().formErrors;
    const message = Array.isArray(errors) ? errors.filter(Boolean).join('; ') : result.error.message;
    return { success: false, error: message || result.error.message };
  }

  return { success: true, data: result.data };
}

export async function createPendingDraft(
  draftInput: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();
    const session = await validateSession(supabase);

    const validation = validateDraftInput(draftInput);
    if (!validation.success) {
      return { success: false, error: `Draft validation failed: ${validation.error}` };
    }

    const validatedDraft = validation.data;

    if (validatedDraft.firm_id !== session.firmId) {
      return { success: false, error: 'Draft firm_id does not match authenticated firm' };
    }

    const payload = {
      ...validatedDraft,
      created_at: validatedDraft.created_at ?? new Date().toISOString(),
      updated_at: validatedDraft.updated_at ?? new Date().toISOString(),
    };

    const { error } = await supabase.from('pending_drafts').insert([payload]);

    if (error) {
      console.error('Failed to insert draft:', error.message);
      return { success: false, error: `Failed to create draft: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Unexpected error in createPendingDraft:', errorMessage);
    return { success: false, error: `An unexpected error occurred: ${errorMessage}` };
  }
}

/**
 * Approve a pending draft (Human-in-the-loop workflow)
 *
 * @param draftId - ID of the draft to approve
 * @param userId - User ID of the reviewer
 * @param firmId - Firm ID for authorization check
 * @param reviewNotes - Optional notes from the reviewer
 * @returns Result with success status or error
 *
 * Security Notes:
 * - Verifies user owns the draft's firm before approval
 * - Records reviewer_id and review_timestamp for auditability
 * - Status change is immutable once approved
 */
export async function approvePendingDraft(
  draftId: string,
  userId?: string,
  firmId?: string,
  reviewNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();
    const session = await validateSession(supabase);

    if (userId && userId !== session.userId) {
      return { success: false, error: 'Session user mismatch' };
    }

    if (firmId && firmId !== session.firmId) {
      return { success: false, error: 'Session firm mismatch' };
    }

    // Verify draft belongs to the authenticated user's firm
    const { data: draft, error: fetchError } = await supabase
      .from('pending_drafts')
      .select('id, firm_id, status')
      .eq('id', draftId)
      .single();

    if (fetchError || !draft) {
      return { success: false, error: 'Draft not found or unauthorized' };
    }

    if (draft.firm_id !== session.firmId) {
      return { success: false, error: 'Unauthorized: Draft does not belong to your firm' };
    }

    if (draft.status !== 'pending_review') {
      return { success: false, error: `Cannot approve draft with status: ${draft.status}` };
    }

    // Update draft status and capture audit metadata
    const { error: updateError } = await supabase
      .from('pending_drafts')
      .update({
        status: 'approved',
        reviewer_id: session.userId,
        review_timestamp: new Date().toISOString(),
        review_notes: reviewNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', draftId);

    if (updateError) {
      console.error('Error approving draft:', updateError.message);
      return { success: false, error: `Failed to approve draft: ${updateError.message}` };
    }

    const approvedBy = session.email ?? session.userId;
    const { error: logError } = await supabase.from('approval_logs').insert([
      {
        draft_id: draftId,
        approved_by: approvedBy,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (logError) {
      console.error('Error inserting approval log:', logError.message);
      return { success: false, error: `Approval succeeded but audit log failed: ${logError.message}` };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Unexpected error in approvePendingDraft:', errorMessage);
    return { success: false, error: `An unexpected error occurred: ${errorMessage}` };
  }
}

/**
 * Reject a pending draft with reviewer notes
 *
 * @param draftId - ID of the draft to reject
 * @param userId - User ID of the reviewer
 * @param firmId - Firm ID for authorization check
 * @param rejectionReason - Reason for rejection (required for audit trail)
 * @returns Result with success status or error
 */
export async function rejectPendingDraft(
  draftId: string,
  userId: string,
  firmId: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return { success: false, error: 'Rejection reason is required' };
    }

    const supabase = await getSupabaseServerClient();
    const session = await validateSession(supabase);

    if (userId && userId !== session.userId) {
      return { success: false, error: 'Session user mismatch' };
    }

    if (firmId && firmId !== session.firmId) {
      return { success: false, error: 'Session firm mismatch' };
    }

    // Verify draft belongs to the authenticated user's firm
    const { data: draft, error: fetchError } = await supabase
      .from('pending_drafts')
      .select('id, firm_id, status')
      .eq('id', draftId)
      .single();

    if (fetchError || !draft) {
      return { success: false, error: 'Draft not found or unauthorized' };
    }

    if (draft.firm_id !== session.firmId) {
      return { success: false, error: 'Unauthorized: Draft does not belong to your firm' };
    }

    if (draft.status !== 'pending_review') {
      return { success: false, error: `Cannot reject draft with status: ${draft.status}` };
    }

    // Update draft status and capture audit metadata
    const { error: updateError } = await supabase
      .from('pending_drafts')
      .update({
        status: 'rejected',
        reviewer_id: session.userId,
        review_timestamp: new Date().toISOString(),
        review_notes: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', draftId);

    if (updateError) {
      console.error('Error rejecting draft:', updateError.message);
      return { success: false, error: `Failed to reject draft: ${updateError.message}` };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Unexpected error in rejectPendingDraft:', errorMessage);
    return { success: false, error: `An unexpected error occurred: ${errorMessage}` };
  }
}

/**
 * Fetch count of approvals per day for the last 7 days (auth required)
 */
export async function fetchApprovalCountsLast7Days(): Promise<
  { date: string; count: number }[]
> {
  try {
    const supabase = await getSupabaseServerClient();
    const session = await validateSession(supabase);

    const firmId = session.firmId;

    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6); // include today => 7 days
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('approval_logs')
      .select('timestamp')
      .gte('timestamp', start.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching approval logs:', error.message);
      return [];
    }

    const countsMap: Record<string, number> = {};
    // initialize last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      countsMap[key] = 0;
    }

    (data ?? []).forEach((row: { timestamp: string }) => {
      const key = new Date(row.timestamp).toISOString().slice(0, 10);
      if (!(key in countsMap)) countsMap[key] = 0;
      countsMap[key]++;
    });

    return Object.keys(countsMap)
      .sort()
      .map((date) => ({ date, count: countsMap[date] }));
  } catch (err) {
    console.error('Unexpected error in fetchApprovalCountsLast7Days:', err);
    return [];
  }
}

/**
 * Get approval statistics for the last 7 days using PostgreSQL aggregation (date_trunc)
 * Returns an array of { date: 'YYYY-MM-DD', count: number } for each of the last 7 days
 */
export async function getApprovalStats(): Promise<{ date: string; count: number }[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const session = await validateSession(supabase);

    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6); // include today => 7 days
    start.setHours(0, 0, 0, 0);

    // Use Postgres date_trunc to aggregate by day server-side
    const sb: any = supabase;
    const res = await sb
      .from('approval_logs')
      .select("date_trunc('day', timestamp) as day, count(id) as count")
      .gte('timestamp', start.toISOString())
      .group('day')
      .order('day', { ascending: true });

    const data = res?.data;
    const error = res?.error;

    if (error) {
      console.error('Error fetching approval stats:', error.message);
      return [];
    }

    const countsMap: Record<string, number> = {};
    // initialize last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      countsMap[key] = 0;
    }

    (data ?? []).forEach((row: any) => {
      const dayVal = row.day;
      const key = dayVal ? new Date(dayVal).toISOString().slice(0, 10) : null;
      const cnt = Number(row.count ?? 0);
      if (key) {
        countsMap[key] = cnt;
      }
    });

    return Object.keys(countsMap)
      .sort()
      .map((date) => ({ date, count: countsMap[date] }));
  } catch (err) {
    console.error('Unexpected error in getApprovalStats:', err);
    return [];
  }
}
