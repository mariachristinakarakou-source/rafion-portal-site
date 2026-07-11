'use client';

/**
 * DashboardSkeleton Component
 * Loading state skeleton for better UX during data fetch
 */

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border border-white/10 rounded-lg p-6 bg-[#0a0a0a] animate-pulse space-y-4"
        >
          {/* Header skeleton */}
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
            <div className="h-8 bg-white/10 rounded w-12" />
          </div>

          {/* Content skeletons */}
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded w-1/4" />
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-white/5 rounded" />
            <div className="h-12 bg-white/5 rounded" />
          </div>

          {/* Actions skeleton */}
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-white/10 rounded" />
            <div className="flex-1 h-10 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
