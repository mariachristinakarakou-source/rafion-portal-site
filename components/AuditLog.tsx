'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface AuditLogEntry {
  id: string;
  draft_id: string;
  approved_by: string;
  timestamp: string;
}

const getSupabaseServerClient = async () => {
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

export default async function AuditLog() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('approval_logs')
    .select('id, draft_id, approved_by, timestamp')
    .order('timestamp', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Failed to load audit logs:', error.message);
    return (
      <section className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Approval Audit Log</h2>
        <p className="text-sm text-gray-400">Unable to load audit entries.</p>
      </section>
    );
  }

  const entries = (data ?? []) as AuditLogEntry[];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Approval Audit Log</h2>
          <p className="text-sm text-gray-400">Latest 10 approvals from the system.</p>
        </div>
        <span className="text-xs uppercase tracking-[0.24em] text-gray-500">Recent</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm text-gray-200">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-gray-500">
              <th className="px-3 py-3">Draft ID</th>
              <th className="px-3 py-3">Approved By</th>
              <th className="px-3 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                  No approval log entries found.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b border-white/5">
                  <td className="px-3 py-4 text-xs text-gray-200 font-mono">{entry.draft_id.slice(0, 8)}...</td>
                  <td className="px-3 py-4 text-sm text-gray-200">{entry.approved_by}</td>
                  <td className="px-3 py-4 text-sm text-gray-400">{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
