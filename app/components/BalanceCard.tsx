'use client'

import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const AVAILABLE_BALANCE_USDC = 1250.5

const CURRENCIES = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateFromUsdc: 1,
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    rateFromUsdc: 5.0,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateFromUsdc: 0.92,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rateFromUsdc: 0.79,
  },
] as const

function formatBalance(value: number, locale: string = 'pt-BR') {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function BalanceCard() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')

  const selected = CURRENCIES.find((c) => c.code === selectedCurrency)
  const balanceInSelectedCurrency = selected
    ? AVAILABLE_BALANCE_USDC * selected.rateFromUsdc
    : AVAILABLE_BALANCE_USDC

  const getLocale = (currencyCode: string) => {
    switch (currencyCode) {
      case 'BRL':
        return 'pt-BR'
      case 'EUR':
        return 'de-DE'
      case 'GBP':
        return 'en-GB'
      case 'USD':
      default:
        return 'en-US'
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm text-white/60">Available balance</p>
        <button
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          className="text-white/60 transition-colors hover:text-white/80"
          aria-label={isBalanceVisible ? 'Hide balance' : 'Show balance'}
        >
          {isBalanceVisible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="mb-4 flex gap-2 items-baseline">
        <p className="text-2xl font-semibold text-white sm:text-3xl">
          {isBalanceVisible ? (
            <>
              {selected?.symbol && (
                <span className="text-white/80">{selected.symbol}</span>
              )}
              {formatBalance(
                balanceInSelectedCurrency,
                getLocale(selectedCurrency),
              )}{' '}
            </>
          ) : (
            <>•••••• </>
          )}
        </p>
        <div className="relative inline-block">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="appearance-none bg-transparent px-1 pr-5 py-0 text-sm font-semibold text-white focus:outline-none [&>option]:bg-[#080d15] [&>option]:text-white"
            aria-label="Select currency"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
            aria-hidden
          />
        </div>
      </div>
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
        href="/balance-details"
        className="block text-center text-sm text-white/60 transition-colors hover:text-white/80"
      >
        View balance details →
      </Link>
    </section>
  )
}
