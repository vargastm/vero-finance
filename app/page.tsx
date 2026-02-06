'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Skeleton } from './components/Skeleton'

const AVAILABLE_BALANCE_USDC = 1250.5

function formatBalance(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function Home() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
      {/* Balance card */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm text-white/60">Available balance</p>
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="text-white/60 transition-colors hover:text-white/80"
            aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            {isBalanceVisible ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
          {isBalanceVisible ? (
            <>
              {formatBalance(AVAILABLE_BALANCE_USDC)}{' '}
              <span className="text-white/80">USDC</span>
            </>
          ) : (
            <>
              •••••• <span className="text-white/80">USDC</span>
            </>
          )}
        </p>
        <div className="flex gap-3">
          <Link
            href="/select-destination/deposit-crypto"
            className="flex flex-1 items-center justify-center rounded-[27px] bg-brand-1  text-sm leading-[1.3] text-brand-5 transition-opacity hover:opacity-90 max-md:w-full h-10"
          >
            Add funds
          </Link>
          <Link
            href="/select-destination"
            className="flex flex-1 items-center justify-center rounded-[27px] border border-white/20 bg-white/5 text-sm leading-[1.3] text-white transition-colors hover:bg-white/10 max-md:w-full h-10"
          >
            Withdraw funds
          </Link>
        </div>
        <hr className="my-5 border-white/10" />
        <Link
          href="#"
          className="block text-center text-sm text-white/60 transition-colors hover:text-white/80"
        >
          View balance details →
        </Link>
      </section>

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
