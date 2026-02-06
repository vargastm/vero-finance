'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'

import { BackButton } from '@/app/components/BackButton'
import { useBalance } from '@/app/contexts/BalanceContext'
import { getUserData } from '@/app/lib/user'

const FIAT_CURRENCIES: Record<
  string,
  { name: string; symbol: string; offrampFeePercent: number }
> = {
  EUR: { name: 'Euro', symbol: '€', offrampFeePercent: 0.5 },
  USD: { name: 'US Dollar', symbol: '$', offrampFeePercent: 0.5 },
  GBP: { name: 'British Pound', symbol: '£', offrampFeePercent: 0.6 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', offrampFeePercent: 0.8 },
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const DEFAULT_DESTINATION = {
  bankName: 'Bank of America',
  accountHolder: '',
  agency: '0001',
  account: '12345-6',
}

function ConfirmWithdrawContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { balance } = useBalance()
  const currencyCode = searchParams.get('currency')
  const amountParam = searchParams.get('amount')
  const amount = useMemo(() => {
    const n = parseFloat(amountParam ?? '')
    return Number.isFinite(n) && n > 0 ? n : null
  }, [amountParam])

  const currency = useMemo(
    () => (currencyCode && FIAT_CURRENCIES[currencyCode]) || null,
    [currencyCode],
  )

  const destination = useMemo(() => {
    const userData = getUserData()
    const defaultAccountHolder =
      userData?.name || DEFAULT_DESTINATION.accountHolder

    return {
      bankName: searchParams.get('bankName') ?? DEFAULT_DESTINATION.bankName,
      accountHolder: searchParams.get('accountHolder') ?? defaultAccountHolder,
      agency: searchParams.get('agency') ?? DEFAULT_DESTINATION.agency,
      account: searchParams.get('account') ?? DEFAULT_DESTINATION.account,
    }
  }, [searchParams])

  if (!currency || !currencyCode || amount === null) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
        <div className="mb-4">
          <BackButton href="/select-destination/bank-transfer" />
        </div>
        <p className="text-white/80">
          {!currencyCode ? 'Select a currency first.' : 'Enter a valid amount.'}
        </p>
        <Link
          href="/select-destination/bank-transfer"
          className="rounded-[27px] bg-brand-1 px-4 py-3 text-center text-sm font-medium text-brand-5 hover:opacity-90"
        >
          Select Fiat Currency
        </Link>
      </main>
    )
  }

  const feeAmount = (amount * currency.offrampFeePercent) / 100
  const receiveAmount = amount - feeAmount

  const [isSendingCode, setIsSendingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userData = getUserData()
  const userEmail = userData?.email || ''
  const firstName = userData?.name?.split(' ')[0] || ''

  const handleSendCode = async () => {
    setIsSendingCode(true)
    setError(null)

    try {
      const response = await fetch('/api/send-withdraw-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currencyCode,
          currencySymbol: currency.symbol,
          feeAmount,
          receiveAmount,
          bankName: destination.bankName,
          accountHolder: destination.accountHolder,
          agency: destination.agency,
          account: destination.account,
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
        amount: amount.toString(),
        currencyCode,
        currencySymbol: currency.symbol,
        feeAmount: feeAmount.toString(),
        receiveAmount: receiveAmount.toString(),
        bankName: destination.bankName,
        accountHolder: destination.accountHolder,
        agency: destination.agency,
        account: destination.account,
      })

      router.push(
        `/select-destination/bank-transfer/confirm/code?${params.toString()}`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending code')
      console.error('Error sending code:', err)
    } finally {
      setIsSendingCode(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BackButton href="/select-destination/bank-transfer" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Confirm Withdraw
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/60">
          Review and confirm your bank transfer withdrawal.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-medium text-white/80">
          Withdrawal summary
        </h2>
        <dl className="space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">Available balance</dt>
            <dd className="font-medium text-white">
              {formatAmount(balance)} USDC
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">Amount</dt>
            <dd className="font-medium text-white">
              {currency.symbol} {formatAmount(amount)} ({currencyCode})
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-white/60">
              Offramp fee ({currency.offrampFeePercent}%)
            </dt>
            <dd className="font-medium text-white">
              {currency.symbol} {formatAmount(feeAmount)}
            </dd>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between text-sm">
              <dt className="text-white/60">You receive</dt>
              <dd className="font-semibold text-white">
                {currency.symbol} {formatAmount(receiveAmount)} ({currencyCode})
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-medium text-white/80">
          Destination (transfer details)
        </h2>
        <dl className="space-y-3">
          <div className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-white/60">Bank</dt>
            <dd className="text-right font-medium text-white">
              {destination.bankName}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-white/60">Account holder</dt>
            <dd className="text-right font-medium text-white">
              {destination.accountHolder}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-white/60">Agency</dt>
            <dd className="text-right font-medium text-white">
              {destination.agency}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-white/60">Account</dt>
            <dd className="text-right font-medium text-white">
              {destination.account}
            </dd>
          </div>
        </dl>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

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
