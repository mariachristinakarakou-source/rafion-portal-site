/**
 * Dashboard Page
 * Institutional-grade dashboard for pending investment draft review
 * Implements a simple pending review list for `pending_drafts`
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import AuditLog from '@/components/AuditLog';
import { fetchPendingDrafts, getApprovalStats } from '@/lib/actions';
import { PendingDraft } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard | Rafion AI',
  description: 'Review pending AI-generated investment analysis drafts',
};

const getServerSupabase = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
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

async function getCurrentSession() {
  const supabase = await getServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}
"use client";
import { motion } from "framer-motion";

// Helper για τα Icons
const SocialIcon = ({ type, href }: { type: 'linkedin' | 'instagram', href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 hover:opacity-70 transition-opacity">
    {type === 'linkedin' ? (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
    ) : (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c0 .796-.645 1.441-1.441 1.441s-1.441-.645-1.441-1.441c0-.796.645-1.441 1.441-1.441s1.441.645 1.441 1.441z"/></svg>
    )}
  </a>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Footer */}
      <footer className="p-12 border-t border-gray-900 flex flex-col items-center gap-4">
        <p className="text-gray-600 text-sm">© 2026 Rafion AI. All rights reserved.</p>
        <div className="flex gap-2">
          <SocialIcon type="linkedin" href="https://linkedin.com" />
          <SocialIcon type="instagram" href="https://instagram.com" />
        </div>
      </footer>
    </main>
  );
}

type ApprovedDraft = Pick<PendingDraft, 'id' | 'deal_title' | 'reviewer_id' | 'review_timestamp'>;


async function fetchRecentApprovals(): Promise<ApprovedDraft[]> {
  const session = await getCurrentSession();
  const firmId = session.user.user_metadata?.firm_id as string | undefined;

  if (!firmId) {
    redirect('/login');
  }

  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('pending_drafts')
    .select('id, deal_title, reviewer_id, review_timestamp')
    .eq('status', 'approved')
    .eq('firm_id', firmId)
    .order('review_timestamp', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load recent approvals: ${error.message}`);
  }

  return (data ?? []) as ApprovedDraft[];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; page?: string };
}) {
  const search = searchParams.search ?? '';
  const status = searchParams.status ?? 'pending_review';
  const page = Math.max(1, Number(searchParams.page ?? '1'));

  const draftsResult = await fetchPendingDrafts(undefined, undefined, 10, page - 1, search, status);
  if (!draftsResult.success) {
    throw new Error(draftsResult.error ?? 'Failed to fetch pending drafts');
  }

  const drafts = draftsResult.data ?? [];
  const approvals = await fetchRecentApprovals();
  const approvalCounts = await getApprovalStats();
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tighter">RAFION AI</span>
            <span className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-1 rounded">
              INSTITUTIONAL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-mono">Pending review drafts</span>
            <button className="text-xs border border-white/20 px-3 py-1.5 rounded hover:bg-white/5 transition">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <section className="space-y-6">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl font-semibold tracking-tight">Pending Drafts</h1>
            <p className="text-sm text-gray-400">
              Showing all rows from <code className="text-white/80">pending_drafts</code> with status <span className="font-semibold">pending_review</span>.
            </p>
          </div>

          <div className="grid gap-6">
            <DashboardShell initialDrafts={drafts} approvalCounts={approvalCounts} />
            <AuditLog />
          </div>

          <section className="space-y-6 mt-10">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-3xl font-semibold tracking-tight">Recent Approvals</h2>
              <p className="text-sm text-gray-400">
                The last 5 drafts approved by your team, pulled from <code className="text-white/80">pending_drafts</code>.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {approvals.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 text-center text-gray-400">
                  No approved drafts yet.
                </div>
              ) : (
                approvals.map((approval) => (
                  <div key={approval.id} className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{approval.deal_title}</h3>
                        <p className="mt-2 text-xs text-gray-500 font-mono">ID: {approval.id.slice(0, 8)}...</p>
                      </div>
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-300">
                        Approved
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-gray-400 space-y-2">
                      <p>
                        <span className="font-medium text-white">Reviewer:</span>{' '}
                        {approval.reviewer_id ?? 'Unknown'}
                      </p>
                      <p>
                        <span className="font-medium text-white">When:</span>{' '}
                        {approval.review_timestamp ? new Date(approval.review_timestamp).toLocaleString() : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505]/50">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-gray-600 font-mono">
          <div className="flex justify-between items-center">
            <span>© 2026 Rafion AI. Institutional Grade.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-400 transition">
                Audit Logs
              </a>
              <a href="#" className="hover:text-gray-400 transition">
                Security
              </a>
              <a href="#" className="hover:text-gray-400 transition">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
