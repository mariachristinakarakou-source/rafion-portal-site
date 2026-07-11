'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

interface DashboardChartProps {
  data: DayCount[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  // ensure data sorted by date ascending
  const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Approvals (Last 7 days)</h2>
          <p className="text-sm text-gray-400">Daily approved drafts</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={sorted} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
            <CartesianGrid stroke="#111" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af' }} />
            <Tooltip wrapperStyle={{ background: '#0b0b0b', borderRadius: 6 }} />
            <Bar dataKey="count" fill="#10b981" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
