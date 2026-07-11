'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardChart from '@/components/DashboardChart';
import { PendingDraft } from '@/lib/types';
import { DashboardDraftList } from './DashboardDraftList';

interface DashboardShellProps {
  initialDrafts: PendingDraft[];
  approvalCounts: { date: string; count: number }[];
}

export default function DashboardShell({ initialDrafts, approvalCounts }: DashboardShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [drafts, setDrafts] = useState<PendingDraft[]>(initialDrafts);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? 'pending_review';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));

        const res = await fetch(`/api/drafts?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (!mounted) return;
        setDrafts(json.data ?? []);
        setTotalCount(json.count ?? 0);
      } catch (err) {
        if (!mounted) return;
        setDrafts([]);
        setTotalCount(0);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    // debounce user typing
    const id = setTimeout(() => {
      load();
    }, 250);

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(id);
    };
}, [search, status, page]);

  const updateQuery = (next: { search?: string; status?: string; page?: number }) => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));

    if (next.search !== undefined) {
      if (next.search) params.set('search', next.search);
      else params.delete('search');
    }

    if (next.status !== undefined) {
      if (next.status) params.set('status', next.status);
      else params.delete('status');
    }

    if (next.page !== undefined) {
      params.set('page', String(next.page));
    } else if (!params.has('page')) {
      params.set('page', '1');
    }

    const path = `${window.location.pathname}?${params.toString()}`;
    router.push(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          value={search}
          onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
          placeholder="Search drafts by title..."
          className="flex-1 rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-2 text-sm text-white"
        />

        <select
          value={status}
          onChange={(e) => updateQuery({ status: e.target.value, page: 1 })}
          className="rounded-lg border border-white/10 bg-[#0b0b0b] px-3 py-2 text-sm text-white"
        >
          <option value="pending_review">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <DashboardDraftList
            initialDrafts={drafts}
            currentPage={page}
            onPageChange={(nextPage) => updateQuery({ page: nextPage })}
            hasNext={page * pageSize < totalCount}
          />
        </div>

        <div>
          <div className="space-y-4">
            <DashboardChart data={approvalCounts} />
          </div>
        </div>
      </div>
    </div>
  );
}
