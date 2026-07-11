'use client';

import { useEffect } from 'react';

interface DashboardErrorProps {
  error: Error;
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard runtime error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 text-center shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <h1 className="text-4xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-4 text-sm text-gray-400">
          There was an unexpected error while loading the dashboard. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
