'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { BackButton } from '@/app/components/BackButton'
import { useBalance } from '@/app/contexts/BalanceContext'
import { getUserData } from '@/app/lib/user'

function ConfirmCodeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { subtractBalance } = useBalance()

  const userData = getUserData()
  const userEmail = userData?.email || ''
  const firstName = userData?.name?.split(' ')[0] || ''
  const amount = searchParams.get('amount')
  const currencyCode = searchParams.get('currencyCode')

  const [confirmationCode, setConfirmationCode] = useState('')
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [isResendingCode, setIsResendingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [withdrawConfirmed, setWithdrawConfirmed] = useState(false)

  const handleResendCode = async () => {
    setIsResendingCode(true)
    setError(null)

    try {
      const response = await fetch('/api/send-withdraw-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount || '0'),
          currencyCode: currencyCode || '',
          currencySymbol: searchParams.get('currencySymbol') || '$',
          feeAmount: parseFloat(searchParams.get('feeAmount') || '0'),
          receiveAmount: parseFloat(searchParams.get('receiveAmount') || '0'),
          bankName: searchParams.get('bankName') || '',
          accountHolder: searchParams.get('accountHolder') || '',
          agency: searchParams.get('agency') || '',
          account: searchParams.get('account') || '',
          userEmail,
          userName: firstName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code')
      }

      // Show temporary success message
      setError(null)
      setSuccessMessage('Code resent successfully!')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error resending code')
      console.error('Error resending code:', err)
    } finally {
      setIsResendingCode(false)
    }
  }

  const handleConfirmWithdraw = async () => {
    // Normalize code - remove any non-numeric characters
    const normalizedCode = confirmationCode.replace(/\D/g, '').trim()

    if (!normalizedCode || normalizedCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsValidatingCode(true)
    setError(null)

    try {
      const response = await fetch('/api/validate-withdraw-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: normalizedCode,
          email: userEmail,
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error('Failed to parse server response')
      }

      if (!response.ok) {
        const errorMessage = data?.error || 'Invalid code'
        throw new Error(errorMessage)
      }

      // Valid code - send confirmation email and confirm withdrawal
      setWithdrawConfirmed(true)

      // Subtract the withdrawal amount from balance
      const withdrawalAmount = parseFloat(amount || '0')
      if (withdrawalAmount > 0) {
        subtractBalance(withdrawalAmount)
      }

      // Send confirmation email
      try {
        await fetch('/api/send-withdraw-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount || '0'),
            currencyCode: currencyCode || '',
            currencySymbol: searchParams.get('currencySymbol') || '$',
            feeAmount: parseFloat(searchParams.get('feeAmount') || '0'),
            receiveAmount: parseFloat(searchParams.get('receiveAmount') || '0'),
            bankName: searchParams.get('bankName') || '',
            accountHolder: searchParams.get('accountHolder') || '',
            agency: searchParams.get('agency') || '',
            account: searchParams.get('account') || '',
            userEmail,
            userName: firstName,
          }),
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't block the flow if email fails
      }

      setTimeout(() => {
        // Redirect to home screen
        router.push('/')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error validating code')
      console.error('Error validating code:', err)
    } finally {
      setIsValidatingCode(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mb-4">
        <BackButton href="/select-destination/bank-transfer/confirm" />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
          Confirmation Code
        </h1>

        <p className="mb-6 text-sm text-white/60">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-white">{userEmail}</span>. Enter the
          code below to confirm the withdrawal.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-500/50 bg-green-500/10 p-3">
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        )}

        {withdrawConfirmed && (
          <div className="mb-4 rounded-xl border border-green-500/50 bg-green-500/10 p-3">
            <p className="text-sm text-green-400">
              Code validated! Confirming withdrawal...
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={confirmationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setConfirmationCode(value)
                setError(null)
              }}
              placeholder="000000"
              disabled={withdrawConfirmed}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 px-4 text-center text-3xl font-mono tracking-[0.5em] text-white placeholder:text-white/40 focus:border-brand-1 focus:outline-none focus:ring-2 focus:ring-brand-1 disabled:opacity-50"
              aria-label="Confirmation code"
            />
          </div>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResendingCode || withdrawConfirmed}
            className="w-full text-center text-sm text-white/60 underline transition-colors hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResendingCode ? 'Resending...' : 'Resend code'}
          </button>
        </div>
      </section>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleConfirmWithdraw}
          disabled={
            isValidatingCode ||
            confirmationCode.length !== 6 ||
            withdrawConfirmed
          }
          className="flex w-full items-center justify-center rounded-[27px] bg-brand-1 px-4 py-3.5 text-sm font-medium text-brand-5 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidatingCode
            ? 'Validating...'
            : withdrawConfirmed
              ? 'Confirmed'
              : 'Confirm Withdrawal'}
        </button>
      </div>
    </main>
  )
}

export default function ConfirmCodePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
        </main>
      }
    >
      <ConfirmCodeContent />
    </Suspense>
  )
}
