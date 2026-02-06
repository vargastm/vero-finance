'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const AVAILABLE_BALANCE_USDC = 1250.5

function formatBalance(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function BalanceCard() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  return (
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
  )
}
