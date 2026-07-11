'use client';

/**
 * DraftCard Component
 * Displays a single pending draft with human-in-the-loop approval/rejection controls
 * Professional, minimal UI designed for institutional users
 */

import { PendingDraft } from '@/lib/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { approveDraft } from '@/app/actions';
import { rejectPendingDraft } from '@/lib/actions';

interface DraftCardProps {
  draft: PendingDraft;
  onAction?: (draftId: string, action: 'approved' | 'rejected') => void;
  userId?: string;
  firmId?: string;
}

export function DraftCard({ draft, firmId, userId, onAction }: DraftCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsLoading(true);
    setActionError(null);

    try {
      await approveDraft(draft.id);
      toast.success('Draft approved successfully!');
      onAction?.(draft.id, 'approved');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve draft';
      toast.error('Failed to approve draft');
      setActionError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!userId || !firmId) {
      setActionError('Reviewer context unavailable for rejection.');
      return;
    }

    if (!rejectReason.trim()) {
      setActionError('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    setActionError(null);

    const result = await rejectPendingDraft(draft.id, userId, firmId, rejectReason);
    setIsLoading(false);

    if (result.success) {
      setShowRejectForm(false);
      setRejectReason('');
      onAction?.(draft.id, 'rejected');
    } else {
      setActionError(result.error || 'Failed to reject draft');
    }
  };

  const confidenceColor =
    draft.valuation_analysis.confidence_score >= 80
      ? 'text-green-400'
      : draft.valuation_analysis.confidence_score >= 60
        ? 'text-yellow-400'
        : 'text-red-400';

  return (
    <div className="border border-white/10 rounded-lg p-6 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{draft.deal_title}</h3>
          <p className="text-xs text-gray-400 font-mono">
            ID: {draft.id.slice(0, 8)}... • Type: {draft.investment_type.toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${confidenceColor}`}>
            {draft.valuation_analysis.confidence_score}%
          </div>
          <p className="text-xs text-gray-500">confidence</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
          Executive Summary
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">{draft.executive_summary}</p>
      </div>

      {/* Valuation & Risk */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 border-l border-white/5 pl-4">
          <p className="text-xs text-gray-500 font-mono">Valuation (Est.)</p>
          <p className="text-base font-semibold text-white">
            ${(draft.valuation_analysis.estimated_valuation / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-600">{draft.valuation_analysis.valuation_method}</p>
        </div>
        <div className="space-y-1 border-l border-white/5 pl-4">
          <p className="text-xs text-gray-500 font-mono">Strategic Fit</p>
          <p className="text-base font-semibold text-white">{draft.strategic_fit_score}/100</p>
          <p className="text-xs text-gray-600">score</p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="space-y-2 bg-red-400/5 border border-red-500/10 rounded px-3 py-3">
        <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wide">
          Risk Assessment
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">{draft.risk_assessment}</p>
      </div>

      {/* RAG Context */}
      <div className="space-y-2 text-xs">
        <p className="text-gray-500 font-mono">
          📚 Sources: {draft.rag_context_used.total_documents_queried} documents queried
          {draft.rag_context_used.top_sources.length > 0 && (
            <>
              {' '}
              • Top: {draft.rag_context_used.top_sources.slice(0, 2).join(', ')}
            </>
          )}
        </p>
      </div>

      {/* Audit Info */}
      <div className="border-t border-white/5 pt-3 text-xs text-gray-600 font-mono flex justify-between">
        <span>Generated: {new Date(draft.created_at).toLocaleDateString()}</span>
        <span>Model v{draft.created_by_model_version}</span>
      </div>

      {/* Action Error */}
      {actionError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded px-3 py-2 text-xs text-red-300">
          {actionError}
        </div>
      )}

      {/* Actions */}
      {!showRejectForm ? (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 px-4 rounded transition"
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Approving...
              </span>
            ) : (
              '✓ Approve'
            )}
          </button>
          {userId && firmId && (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={isLoading}
              className="flex-1 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 text-red-400 text-sm font-semibold py-2 px-4 rounded transition"
            >
              ✕ Reject
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isLoading || !rejectReason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold py-2 px-4 rounded transition"
            >
              {isLoading ? 'Processing...' : 'Confirm Rejection'}
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason('');
              }}
              disabled={isLoading}
              className="flex-1 border border-white/10 hover:bg-white/5 text-gray-400 text-sm font-semibold py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
