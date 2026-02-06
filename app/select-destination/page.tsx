'use client'

import Link from 'next/link'

function CryptoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v3M12 15v3M9 9l3 3 3-3M9 15l3-3 3 3" />
    </svg>
  )
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  )
}

export default function SelectDestinationPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
      <div>
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Voltar
        </Link>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">
          Select Destination
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Choose how you want to receive your funds.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Link
          href="/select-destination/deposit-crypto"
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-1/20 text-brand-1 transition-colors group-hover:bg-brand-1/30">
            <CryptoIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium text-white">Deposit Cryptocurrency</h2>
            <p className="mt-0.5 text-sm text-white/60">
              Receive funds to your crypto wallet
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70"
            aria-hidden
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <Link
          href="/select-destination/bank-transfer"
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-1/20 text-brand-1 transition-colors group-hover:bg-brand-1/30">
            <BankIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium text-white">Bank Transfer</h2>
            <p className="mt-0.5 text-sm text-white/60">
              Receive funds to your bank account
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70"
            aria-hidden
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </main>
  )
}
