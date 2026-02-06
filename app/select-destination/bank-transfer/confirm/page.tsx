'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo } from 'react'

import { BackButton } from '@/app/components/BackButton'

const FIAT_CURRENCIES: Record<
  string,
  { name: string; symbol: string; offrampFeePercent: number }
> = {
  EUR: { name: 'Euro', symbol: '€', offrampFeePercent: 0.5 },
  USD: { name: 'US Dollar', symbol: '$', offrampFeePercent: 0.5 },
  GBP: { name: 'British Pound', symbol: '£', offrampFeePercent: 0.6 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', offrampFeePercent: 0.8 },
}

const AVAILABLE_BALANCE = 1250.5

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const DEFAULT_DESTINATION = {
  bankName: 'Bank of America',
  accountHolder: 'John Doe',
  agency: '0001',
  account: '12345-6',
}

function ConfirmWithdrawContent() {
  const searchParams = useSearchParams()
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

  const destination = useMemo(
    () => ({
      bankName: searchParams.get('bankName') ?? DEFAULT_DESTINATION.bankName,
      accountHolder:
        searchParams.get('accountHolder') ?? DEFAULT_DESTINATION.accountHolder,
      agency: searchParams.get('agency') ?? DEFAULT_DESTINATION.agency,
      account: searchParams.get('account') ?? DEFAULT_DESTINATION.account,
    }),
    [searchParams],
  )

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

  const handleConfirm = () => {
    alert(
      `Withdrawal confirmed: ${formatAmount(amount)} ${currencyCode}. (API integration coming soon)`,
    )
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
              {formatAmount(AVAILABLE_BALANCE)} USDC
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

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleConfirm}
          className="flex w-full items-center justify-center rounded-[27px] bg-brand-1 px-4 py-3.5 text-sm font-medium text-brand-5 transition-opacity hover:opacity-90"
        >
          Confirm Withdraw
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
