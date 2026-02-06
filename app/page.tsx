'use client'

import { BalanceCard } from './components/BalanceCard'
import { Skeleton } from './components/Skeleton'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
      <BalanceCard />

      {/* Chart area skeleton */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mb-2 h-32 w-full sm:h-40" />
        <div className="flex justify-between gap-2">
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
        </div>
      </section>

      {/* Recent activity header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Transaction list skeletons */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 max-w-[140px]" />
              <Skeleton className="h-3 w-1/2 max-w-[100px]" />
            </div>
            <Skeleton className="h-5 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </main>
  )
}
