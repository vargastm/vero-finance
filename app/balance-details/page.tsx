'use client'

import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { BackButton } from '@/app/components/BackButton'
import { useBalance } from '@/app/contexts/BalanceContext'

interface Balance {
  symbol: string
  name: string
  amount: number
  usdValue: number
  network: string
  iconColor: string
}

function formatBalance(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCrypto(value: number, symbol: string) {
  // Different decimals for different cryptos
  const decimals: Record<string, number> = {
    USDC: 2,
    USDT: 2,
    ETH: 4,
    BTC: 6,
    SOL: 2,
  }

  const decimalPlaces = decimals[symbol] || 2

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value)
}

function getCryptoLogoUrl(symbol: string): string {
  // Using CoinGecko API for crypto logos
  const logoMap: Record<string, string> = {
    USDC: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  }
  return logoMap[symbol] || ''
}

export default function BalanceDetailsPage() {
  const { balance, addBalance } = useBalance()
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const BALANCES: Balance[] = [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      amount: balance,
      usdValue: balance,
      network: 'Solana',
      iconColor: 'bg-blue-500',
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      amount: 0,
      usdValue: 0,
      network: 'Ethereum',
      iconColor: 'bg-green-500',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0,
      usdValue: 0,
      network: 'Ethereum',
      iconColor: 'bg-blue-400',
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0,
      usdValue: 0,
      network: 'Bitcoin',
      iconColor: 'bg-orange-500',
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: 0,
      usdValue: 0,
      network: 'Solana',
      iconColor: 'bg-purple-500',
    },
  ]

  const totalUsdValue = BALANCES.reduce(
    (sum, balance) => sum + balance.usdValue,
    0,
  )

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <BackButton href="/" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Balance Details
          </h1>
        </div>
      </div>

      {/* Total Balance */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm text-white/60">Estimated total value</p>
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
        <p className="mb-3 text-2xl font-semibold text-white sm:text-3xl">
          {isBalanceVisible ? (
            <>${formatBalance(totalUsdValue)}</>
          ) : (
            <>$••••••</>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addBalance(1000)}
            className="flex flex-1 items-center justify-center rounded-[27px] bg-brand-1 text-sm leading-[1.3] text-brand-5 transition-opacity hover:opacity-90 h-10"
          >
            Add funds
          </button>
          <Link
            href="/select-destination"
            className="flex flex-1 items-center justify-center rounded-[27px] border border-white/30 bg-gray-800/50 text-sm leading-[1.3] text-white transition-colors hover:bg-gray-800/70 h-10"
          >
            Withdraw funds
          </Link>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-white/80">Your crypto</h2>
        {BALANCES.map((balance) => (
          <div key={balance.symbol} className="flex items-center gap-3 py-2">
            {/* Crypto Icon */}
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
              <Image
                src={getCryptoLogoUrl(balance.symbol)}
                alt={balance.name}
                width={28}
                height={28}
                className="rounded-full"
                unoptimized
              />
            </div>

            {/* Crypto Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">{balance.symbol}</h3>
              </div>
              <p className="mt-0 text-xs text-white/60">on {balance.network}</p>
            </div>

            {/* Balance Info */}
            <div className="flex shrink-0 flex-col items-end">
              {isBalanceVisible ? (
                <>
                  <p className="text-base font-medium text-white">
                    {formatCrypto(balance.amount, balance.symbol)}
                  </p>
                  <p className="text-xs text-white/60">
                    ${formatBalance(balance.usdValue)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-medium text-white">••••••</p>
                  <p className="text-xs text-white/60">$••••••</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
