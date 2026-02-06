'use client'

import { ChevronRight, Landmark, Wallet } from 'lucide-react'
import Link from 'next/link'

import { BackButton } from '@/app/components/BackButton'

export default function SelectDestinationPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BackButton href="/" />
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Select Destination
          </h1>
        </div>
        <p className="mt-1 text-sm text-white/60">
          Choose how you want to receive your funds.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Link
          href="/select-destination/withdraw-crypto/connect-wallet"
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-1/20 text-brand-1 transition-colors group-hover:bg-brand-1/30">
            <Wallet className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium text-white">Withdraw Cryptocurrency</h2>
            <p className="mt-0.5 text-sm text-white/60">
              Send funds to your crypto wallet
            </p>
          </div>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70"
            aria-hidden
          />
        </Link>

        <Link
          href="/select-destination/bank-transfer"
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-1/20 text-brand-1 transition-colors group-hover:bg-brand-1/30">
            <Landmark className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium text-white">Bank Transfer</h2>
            <p className="mt-0.5 text-sm text-white/60">
              Receive funds to your bank account
            </p>
          </div>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70"
            aria-hidden
          />
        </Link>
      </div>
    </main>
  )
}
