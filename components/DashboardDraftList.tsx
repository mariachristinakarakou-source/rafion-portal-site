'use client';

import { useEffect, useState } from 'react';
import { DraftCard } from '@/components/DraftCard';
import { PendingDraft } from '@/lib/types';

interface DashboardDraftListProps {
  initialDrafts: PendingDraft[];
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
}

export function DashboardDraftList({ initialDrafts, currentPage, onPageChange, hasNext }: DashboardDraftListProps) {
  const [drafts, setDrafts] = useState<PendingDraft[]>(initialDrafts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(initialDrafts);
    setIsLoading(true);

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [initialDrafts]);

  const handleDraftAction = (draftId: string, action: 'approved' | 'rejected') => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading pending drafts...
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
          No pending drafts. New items will appear here once they are ready for review.
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-4">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {currentPage}</span>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {drafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} onAction={handleDraftAction} />
      ))}

      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-4">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">Page {currentPage}</span>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
