'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { BackButton } from '@/app/components/BackButton'
import { useBalance } from '@/app/contexts/BalanceContext'

const FIAT_CURRENCIES = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    offrampFeePercent: 0.5,
    rateFromUsdc: 1,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    offrampFeePercent: 0.5,
    rateFromUsdc: 0.92,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    offrampFeePercent: 0.6,
    rateFromUsdc: 0.79,
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    offrampFeePercent: 0.8,
    rateFromUsdc: 5.0,
  },
] as const

function formatBalance(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function BankTransferPage() {
  const router = useRouter()
  const { balance } = useBalance()
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')
  const [amount, setAmount] = useState('')

  const selected = FIAT_CURRENCIES.find((c) => c.code === selectedCurrency)
  const balanceInSelectedCurrency = selected
    ? balance * selected.rateFromUsdc
    : 0
  const amountNum = parseFloat(amount) || 0
  const isValidAmount = amountNum > 0 && amountNum <= balanceInSelectedCurrency

  const handleMax = () => {
    setAmount(String(balanceInSelectedCurrency.toFixed(2)))
  }

  const handleContinue = () => {
    if (!selectedCurrency || !isValidAmount) return
    router.push(
      `/select-destination/bank-transfer/confirm?currency=${selectedCurrency}&amount=${encodeURIComponent(amount.trim())}`,
    )
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BackButton href="/select-destination" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Bank Transfer
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/60">
          Select the fiat currency for your withdrawal.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <label
          htmlFor="fiat-currency"
          className="text-sm font-medium text-white/80"
        >
          Select Fiat Currency
        </label>
        <div className="relative">
          <select
            id="fiat-currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-4 pr-10 text-base text-white focus:border-brand-1 focus:outline-none focus:ring-1 focus:ring-brand-1 [&>option]:bg-[#080d15] [&>option]:text-white"
            aria-label="Select fiat currency"
          >
            {FIAT_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name} ({currency.code})
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
            aria-hidden
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <p className="text-sm text-white/60">Available balance</p>
        <p className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
          {selected
            ? `${formatBalance(balanceInSelectedCurrency)} ${selected.code}`
            : '—'}
        </p>
        <p className="mt-1 text-xs text-white/50">
          ≈ {formatBalance(balance)} USDC
        </p>
      </section>

      {selected && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-white/80">Amount</h2>
          <div className="flex gap-2">
            <div className="relative flex flex-1 items-center">
              <span className="absolute left-4 text-lg text-white/60">
                {selected.symbol}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-4 text-lg text-white placeholder:text-white/40 focus:border-brand-1 focus:outline-none focus:ring-1 focus:ring-brand-1"
                aria-label="Withdrawal amount"
              />
            </div>
            <button
              type="button"
              onClick={handleMax}
              className="rounded-xl border border-brand-1 bg-brand-1/10 px-4 py-3 text-sm font-medium text-brand-1 transition-colors hover:bg-brand-1/20"
            >
              Max
            </button>
          </div>
          {amountNum > balanceInSelectedCurrency && (
            <p className="text-sm text-red-400">
              Amount exceeds available balance.
            </p>
          )}
        </section>
      )}

      {/* Show withdraw fee (offramp fee) */}
      {selected && (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-medium text-white/80">
            Withdraw fee (offramp fee)
          </h2>
          <p className="text-2xl font-semibold text-brand-1">
            {selected.offrampFeePercent}%
          </p>
          <p className="mt-1 text-sm text-white/60">
            Applied to your withdrawal amount in {selected.code}.
          </p>
        </section>
      )}

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedCurrency || !isValidAmount}
          className="flex w-full items-center justify-center rounded-[27px] bg-brand-1 px-4 py-3.5 text-sm font-medium text-brand-5 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90"
        >
          Continue to confirm
        </button>
      </div>
    </main>
  )
}
