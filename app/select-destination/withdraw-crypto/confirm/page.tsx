'use client'

import { Check, Copy } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { BackButton } from '@/app/components/BackButton'
import { useBalance } from '@/app/contexts/BalanceContext'
import { getUserData } from '@/app/lib/user'

const NETWORKS: Record<
  string,
  {
    name: string
    symbol: string
    gasFee: number
    offrampFeePercent: number
  }
> = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    gasFee: 0.001,
    offrampFeePercent: 0.5,
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    gasFee: 0.0001,
    offrampFeePercent: 0.3,
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ETH',
    gasFee: 0.0005,
    offrampFeePercent: 0.3,
  },
  base: {
    name: 'Base',
    symbol: 'ETH',
    gasFee: 0.0002,
    offrampFeePercent: 0.3,
  },
}

function formatBalance(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)
}

function formatAddress(address: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function ConfirmWithdrawContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const { balance } = useBalance()
  const networkId = searchParams.get('network')
  const amountParam = searchParams.get('amount')
  const [copied, setCopied] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userData = getUserData()
  const userEmail = userData?.email || ''
  const firstName = userData?.name?.split(' ')[0] || ''

  const amount = useMemo(() => {
    const n = parseFloat(amountParam ?? '')
    return Number.isFinite(n) && n > 0 ? n : null
  }, [amountParam])

  // Redirect if not connected
  if (typeof window !== 'undefined' && !isConnected) {
    router.push('/select-destination/withdraw-crypto/connect-wallet')
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
      </main>
    )
  }

  const network = useMemo(
    () => (networkId && NETWORKS[networkId]) || null,
    [networkId],
  )

  if (!network || !networkId || !address || amount === null) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mb-4">
          <BackButton href="/select-destination/withdraw-crypto/select-network" />
        </div>
        <p className="text-white/80">
          {!networkId
            ? 'Select a network first.'
            : amount === null
              ? 'Enter a valid amount.'
              : 'Please connect your wallet.'}
        </p>
        <button
          onClick={() =>
            router.push('/select-destination/withdraw-crypto/select-network')
          }
          className="rounded-[27px] bg-brand-1 px-4 py-3 text-center text-sm font-medium text-brand-5 hover:opacity-90"
        >
          Select Network
        </button>
      </main>
    )
  }

  const handleCopy = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const feeAmount = (amount * network.offrampFeePercent) / 100
  const receiveAmount = amount - feeAmount

  const handleSendCode = async () => {
    if (!address || !network || amount === null) return

    setIsSendingCode(true)
    setError(null)

    try {
      // Calculate fees using the selected amount
      const withdrawalAmount = amount
      const offrampFeeAmount = feeAmount
      const receiveAmountCalculated = receiveAmount

      // Send confirmation code email
      const response = await fetch('/api/send-withdraw-crypto-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: withdrawalAmount,
          currencyCode: 'USDC',
          currencySymbol: '$',
          feeAmount: offrampFeeAmount,
          receiveAmount: receiveAmountCalculated,
          networkName: network.name,
          networkSymbol: network.symbol,
          walletAddress: address,
          gasFee: formatBalance(network.gasFee),
          userEmail,
          userName: firstName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send confirmation code')
      }

      // Redirect to confirmation code page
      const params = new URLSearchParams({
        amount: withdrawalAmount.toString(),
        currencyCode: 'USDC',
        currencySymbol: '$',
        feeAmount: offrampFeeAmount.toString(),
        receiveAmount: receiveAmount.toString(),
        network: networkId,
        networkName: network.name,
        networkSymbol: network.symbol,
        walletAddress: address,
        gasFee: formatBalance(network.gasFee),
      })

      router.push(
        `/select-destination/withdraw-crypto/confirm/code?${params.toString()}`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending code')
      console.error('Error sending code:', err)
    } finally {
      setIsSendingCode(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BackButton href="/select-destination/withdraw-crypto/select-network" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Confirm Withdraw
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/60">
          Review and confirm your cryptocurrency withdrawal.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-medium text-white/80">
          Destination Address
        </h2>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm text-white">{address}</p>
            <p className="mt-1 text-xs text-white/60">
              {formatAddress(address)}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
            aria-label="Copy address"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-white/70" />
            )}
          </button>
        </div>
        <p className="mt-3 text-xs text-white/50">
          This is your connected wallet address. Funds will be sent to this
          address.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-medium text-white/80">
          Withdrawal Summary
        </h2>
        <dl className="space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">Available balance</dt>
            <dd className="font-medium text-white">
              {formatBalance(balance)} USDC
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">Amount</dt>
            <dd className="font-medium text-white">
              ${formatBalance(amount)} USDC
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">
              Offramp fee ({network.offrampFeePercent}%)
            </dt>
            <dd className="font-medium text-white">
              ${formatBalance(feeAmount)}
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">Network</dt>
            <dd className="font-medium text-white">{network.name}</dd>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="mb-2 flex justify-between text-sm">
              <dt className="text-white/60">Gas fee (estimated)</dt>
              <dd className="font-medium text-white">
                ~{formatBalance(network.gasFee)} {network.symbol}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-white/60 font-semibold">You receive</dt>
              <dd className="font-semibold text-white">
                ${formatBalance(receiveAmount)} USDC
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSendingCode}
          className="flex w-full items-center justify-center rounded-[27px] bg-brand-1 px-4 py-3.5 text-sm font-medium text-brand-5 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingCode ? 'Sending code...' : 'Send confirmation code'}
        </button>
      </div>
    </main>
  )
}

export default function ConfirmWithdrawPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
          <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
        </main>
      }
    >
      <ConfirmWithdrawContent />
    </Suspense>
  )
}
