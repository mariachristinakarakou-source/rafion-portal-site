'use server';

import { approvePendingDraft } from '@/lib/actions';

/**
 * Approve a pending draft using Supabase.
 *
 * This Server Action updates the row in `pending_drafts` with the
 * provided id and sets its status to `approved`.
 *
 * The request is validated against the authenticated Supabase session,
 * and audit metadata is captured on the approved draft row.
 */
export async function approveDraft(id: string) {
  if (!id) {
    throw new Error('Draft id is required');
  }

  const result = await approvePendingDraft(id);

  if (!result.success) {
    throw new Error(`Unable to approve draft: ${result.error ?? 'Unauthorized or invalid draft'}`);
  }

  return true;
}
