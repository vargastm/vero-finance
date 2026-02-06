'use client'

import Link from 'next/link'

export default function BankTransferPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
      <div>
        <Link
          href="/select-destination"
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
          Bank Transfer
        </h1>
        <p className="mt-1 text-sm text-white/60">
          This flow will be implemented next.
        </p>
      </div>
    </main>
  )
}
