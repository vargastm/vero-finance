'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BalanceCard } from './components/BalanceCard'
import { Skeleton } from './components/Skeleton'
import { hasUserData } from './lib/user'

export default function Home() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user has already filled in their data
    if (!hasUserData()) {
      router.push('/welcome')
    } else {
      setIsChecking(false)
    }
  }, [router])

  // Show loading while checking
  if (isChecking) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Skeleton className="h-8 w-32" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      {/* Desktop: Grid layout com conteúdos lado a lado */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6">
        {/* BalanceCard */}
        <div className="lg:col-span-1">
          <BalanceCard />
        </div>

        {/* Chart area skeleton */}
        <section className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:col-span-1 lg:h-full">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="mb-2 flex-1 w-full" />
          <div className="flex justify-between gap-2">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        </section>
      </div>

      {/* Recent activity section - ocupa largura total no desktop */}
      <div className="flex flex-col gap-3">
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
      </div>
    </main>
  )
}
