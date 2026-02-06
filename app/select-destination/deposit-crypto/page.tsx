'use client'

import { BackButton } from '@/app/components/BackButton'

export default function DepositCryptoPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BackButton href="/select-destination" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Deposit Cryptocurrency
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/60">
          This flow will be implemented next.
        </p>
      </div>
    </main>
  )
}
