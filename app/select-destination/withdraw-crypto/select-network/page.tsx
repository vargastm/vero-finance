'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { BackButton } from '@/app/components/BackButton'

const NETWORKS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    gasFee: 0.001,
    offrampFeePercent: 0.5,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    gasFee: 0.0001,
    offrampFeePercent: 0.3,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ETH',
    gasFee: 0.0005,
    offrampFeePercent: 0.3,
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    gasFee: 0.0002,
    offrampFeePercent: 0.3,
  },
] as const

const AVAILABLE_BALANCE_USDC = 1250.5

function formatBalance(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)
}

export default function SelectNetworkPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum')
  const [amount, setAmount] = useState('')

  // Redirect if not connected
  if (typeof window !== 'undefined' && !isConnected) {
    router.push('/select-destination/withdraw-crypto/connect-wallet')
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
      </main>
    )
  }

  const selected = NETWORKS.find((n) => n.id === selectedNetwork)
  const amountNum = parseFloat(amount) || 0
  const isValidAmount = amountNum > 0 && amountNum <= AVAILABLE_BALANCE_USDC

  const handleMax = () => {
    setAmount(String(AVAILABLE_BALANCE_USDC.toFixed(2)))
  }

  const handleContinue = () => {
    if (!selectedNetwork || !selected || !isValidAmount) return
    router.push(
      `/select-destination/withdraw-crypto/confirm?network=${selectedNetwork}&amount=${encodeURIComponent(amount.trim())}`,
    )
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BackButton href="/select-destination/withdraw-crypto/connect-wallet" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Select Network
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/60">
          Choose the blockchain network for your withdrawal.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <label htmlFor="network" className="text-sm font-medium text-white/80">
          Select Network
        </label>
        <div className="relative">
          <select
            id="network"
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-4 pr-10 text-base text-white focus:border-brand-1 focus:outline-none focus:ring-1 focus:ring-brand-1 [&>option]:bg-[#080d15] [&>option]:text-white"
            aria-label="Select network"
          >
            {NETWORKS.map((network) => (
              <option key={network.id} value={network.id}>
                {network.name}
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
          {formatBalance(AVAILABLE_BALANCE_USDC)} USDC
        </p>
      </section>

      {selected && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-white/80">Amount</h2>
          <div className="flex gap-2">
            <div className="relative flex flex-1 items-center">
              <span className="absolute left-4 text-lg text-white/60">$</span>
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
          {amountNum > AVAILABLE_BALANCE_USDC && (
            <p className="text-sm text-red-400">
              Amount exceeds available balance.
            </p>
          )}
        </section>
      )}

      {selected && (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-medium text-white/80">
            Network Information
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/60">Network</dt>
              <dd className="font-medium text-white">{selected.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">Estimated Gas Fee</dt>
              <dd className="font-medium text-white">
                ~{formatBalance(selected.gasFee)} {selected.symbol}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">Offramp Fee</dt>
              <dd className="font-medium text-white">
                {selected.offrampFeePercent}%
              </dd>
            </div>
          </dl>
        </section>
      )}

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedNetwork || !isValidAmount}
          className="flex w-full items-center justify-center rounded-[27px] bg-brand-1 px-4 py-3.5 text-sm font-medium text-brand-5 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90"
        >
          Continue to confirm
        </button>
      </div>
    </main>
  )
}
