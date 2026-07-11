'use client';

/**
 * Dashboard Client Component
 * Manages state, error handling, and loading for pending drafts
 * Implements human-in-the-loop workflow for institutional review
 */

import { useEffect, useState, useCallback } from 'react';
import { fetchPendingDrafts } from '@/lib/actions';
import { PendingDraft, DashboardState } from '@/lib/types';
import { DraftCard } from './DraftCard';
import { DashboardSkeleton } from './DashboardSkeleton';

interface DashboardContentProps {
  userId: string;
  firmId: string;
}

export function DashboardContent({ userId, firmId }: DashboardContentProps) {
  const [state, setState] = useState<DashboardState>({
    drafts: [],
    isLoading: true,
    error: null,
    totalCount: 0,
    pageNumber: 0,
  });

  const loadDrafts = useCallback(
    async (pageNumber: number = 0) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await fetchPendingDrafts(userId, firmId, 10, pageNumber);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          drafts: result.data || [],
          totalCount: result.count || 0,
          pageNumber,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error || 'An error occurred while fetching drafts',
          isLoading: false,
        }));
      }
    },
    [userId, firmId]
  );

  // Initial load on component mount
  useEffect(() => {
    loadDrafts(0);
  }, [loadDrafts]);

  const handleDraftAction = useCallback(
    (draftId: string, action: 'approved' | 'rejected') => {
      // Remove the draft from the list after approval/rejection
      setState((prev) => ({
        ...prev,
        drafts: prev.drafts.filter((d) => d.id !== draftId),
        totalCount: Math.max(0, prev.totalCount - 1),
      }));
    },
    []
  );

  const handleRetry = () => {
    loadDrafts(state.pageNumber);
  };

  // Loading state
  if (state.isLoading && state.drafts.length === 0) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (state.error && state.drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Unable to Load Drafts</h2>
            <p className="text-gray-400">{state.error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 px-4 rounded transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (state.drafts.length === 0 && !state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">✓</div>
          <h2 className="text-2xl font-semibold text-white">No Pending Drafts</h2>
          <p className="text-gray-400">
            All AI-generated investment analyses have been reviewed. New drafts will appear here when
            the system identifies promising opportunities.
          </p>
        </div>
      </div>
    );
  }

  // Drafts list with pagination info
  return (
    <div className="space-y-6">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Pending Drafts</h1>
          <p className="text-gray-400 text-sm">
            {state.totalCount} {state.totalCount === 1 ? 'draft' : 'drafts'} awaiting review
          </p>
        </div>
        <div className="text-right text-xs text-gray-500 font-mono">
          Page {state.pageNumber + 1} • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Drafts grid */}
      <div className="grid gap-4">
        {state.drafts.map((draft) => (
          <DraftCard
            key={draft.id}
            draft={draft}
            firmId={firmId}
            userId={userId}
            onAction={handleDraftAction}
          />
        ))}
      </div>

      {/* Pagination */}
      {state.totalCount > 10 && (
        <div className="flex justify-between items-center border-t border-white/10 pt-6">
          <button
            onClick={() => loadDrafts(state.pageNumber - 1)}
            disabled={state.pageNumber === 0 || state.isLoading}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 disabled:opacity-50 text-gray-400 hover:text-white font-semibold rounded transition"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500 font-mono">
            Showing {state.pageNumber * 10 + 1}–
            {Math.min((state.pageNumber + 1) * 10, state.totalCount)} of {state.totalCount}
          </span>
          <button
            onClick={() => loadDrafts(state.pageNumber + 1)}
            disabled={(state.pageNumber + 1) * 10 >= state.totalCount || state.isLoading}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 disabled:opacity-50 text-gray-400 hover:text-white font-semibold rounded transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* Error toast (if error but drafts exist) */}
      {state.error && state.drafts.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-300 max-w-xs">
          ⚠️ {state.error}
        </div>
      )}
    </div>
  );
}
