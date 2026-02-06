'use client'

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Landmark,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'

import { BackButton } from '@/app/components/BackButton'
import { Skeleton } from '@/app/components/Skeleton'

export default function DesignSystemPage() {
  const [copied, setCopied] = useState(false)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const handleCopy = async () => {
    await navigator.clipboard.writeText('0x1234...5678')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Design System
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Complete documentation of Vero Finance components and styles
        </p>
      </div>

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Colors</h2>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-medium text-white">
            Primary Palette
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-brand-5 border border-white/10" />
              <div>
                <p className="text-sm font-medium text-white">
                  Background / Brand 5
                </p>
                <p className="text-xs text-white/60">#080d15</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Body background, Header, selects
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  CSS vars: --background, --color-brand-5
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-[#ededed] border border-white/10" />
              <div>
                <p className="text-sm font-medium text-white">Foreground</p>
                <p className="text-xs text-white/60">#ededed</p>
                <p className="text-xs text-white/40 mt-0.5">Text color</p>
                <p className="text-xs text-white/30 mt-0.5">
                  CSS var: --foreground
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-brand-1 border border-white/10" />
              <div>
                <p className="text-sm font-medium text-white">Brand 1</p>
                <p className="text-xs text-white/60">#f9c438</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Primary accent color
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  CSS var: --color-brand-1
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-medium text-white">
            Opacities (White Opacity)
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {[5, 10, 20, 40, 50, 60, 70, 80].map((opacity) => (
              <div key={opacity} className="space-y-2">
                <div
                  className="h-16 rounded-xl border border-white/10"
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
                  }}
                />
                <div>
                  <p className="text-xs font-medium text-white">
                    white/{opacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-medium text-white">States</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-16 rounded-xl border border-red-500/50 bg-red-500/10" />
              <div>
                <p className="text-sm font-medium text-white">Error</p>
                <p className="text-xs text-white/60">red-500/50, red-500/10</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-xl border border-green-500/50 bg-green-500/10" />
              <div>
                <p className="text-sm font-medium text-white">Success</p>
                <p className="text-xs text-white/60">green-400, green-500/10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Typography</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Primary Font</p>
            <p className="mt-1 text-sm text-white/60">
              Manrope (Google Fonts) - Applied globally via Next.js Font
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Heading 1 - Bold
              </h1>
              <p className="mt-1 text-xs text-white/60">
                text-3xl sm:text-4xl font-bold
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Heading 2 - Semibold
              </h2>
              <p className="mt-1 text-xs text-white/60">
                text-2xl font-semibold
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Heading 3 - Responsive Semibold
              </h3>
              <p className="mt-1 text-xs text-white/60">
                text-xl sm:text-2xl font-semibold
              </p>
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                Body Large - Medium
              </p>
              <p className="mt-1 text-xs text-white/60">text-lg font-medium</p>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Body Small - Medium
              </p>
              <p className="mt-1 text-xs text-white/60">text-sm font-medium</p>
            </div>
            <div>
              <p className="text-sm text-white/60">
                Body Small - Secondary (text-white/60)
              </p>
              <p className="mt-1 text-xs text-white/60">
                text-sm text-white/60
              </p>
            </div>
            <div>
              <p className="font-mono text-sm text-white">
                0x1234567890abcdef - Mono
              </p>
              <p className="mt-1 text-xs text-white/60">font-mono text-sm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Spacing</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-4">
            {[3, 4, 5, 6, 8].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-16 text-xs text-white/60">gap-{size}</div>
                <div className="flex-1">
                  <div
                    className="h-4 rounded bg-brand-1"
                    style={{ width: `${size * 0.25}rem` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Border Radius</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-white/10" />
              <p className="text-xs text-white/60">rounded-lg</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-white/10" />
              <p className="text-xs text-white/60">rounded-xl</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-2xl bg-white/10" />
              <p className="text-xs text-white/60">rounded-2xl</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-[27px] bg-white/10" />
              <p className="text-xs text-white/60">rounded-[27px]</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-full bg-white/10" />
              <p className="text-xs text-white/60">rounded-full</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Buttons</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium text-white/80">
                Primary Button
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-[27px] bg-brand-1 px-4 py-3 text-sm font-medium text-brand-5 transition-opacity hover:opacity-90">
                  Primary Button
                </button>
                <button
                  disabled
                  className="rounded-[27px] bg-brand-1 px-4 py-3 text-sm font-medium text-brand-5 opacity-50 cursor-not-allowed"
                >
                  Disabled
                </button>
              </div>
              <p className="mt-2 text-xs text-white/60">
                bg-brand-1 text-brand-5 rounded-[27px] hover:opacity-90
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-white/80">
                Secondary Button
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-[27px] border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  Secondary Button
                </button>
                <button
                  disabled
                  className="rounded-[27px] border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white opacity-50 cursor-not-allowed"
                >
                  Disabled
                </button>
              </div>
              <p className="mt-2 text-xs text-white/60">
                border border-white/20 bg-white/5 hover:bg-white/10
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-white/80">
                Icon Button (BackButton)
              </h3>
              <BackButton href="#" aria-label="Back" />
              <p className="mt-2 text-xs text-white/60">
                rounded-full border border-white/10 bg-white/5 p-2
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Cards</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h3 className="mb-2 text-sm font-medium text-white">
              Default Card
            </h3>
            <p className="text-sm text-white/60">
              This is an example of the default card used throughout the system.
            </p>
            <p className="mt-4 text-xs text-white/50">
              border border-white/10 bg-white/5 rounded-2xl p-5 sm:p-6
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-medium text-white/80">
              Card with List
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-white/60">Label</dt>
                <dd className="font-medium text-white">Value</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-white/60">Another Label</dt>
                <dd className="font-medium text-white">Another Value</dd>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-white/60 font-semibold">Total</dt>
                  <dd className="font-semibold text-white">$1,000.00</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Inputs</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="default-input"
                className="mb-2 block text-sm text-white/60"
              >
                Default Input
              </label>
              <input
                id="default-input"
                type="text"
                placeholder="Type something..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="select-input"
                className="mb-2 block text-sm text-white/60"
              >
                Select
              </label>
              <div className="relative">
                <select
                  id="select-input"
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none [&>option]:bg-brand-5 [&>option]:text-white"
                >
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complex Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Complex Components
        </h2>

        {/* Balance Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-medium text-white/80">
            Balance Card
          </h3>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm text-white/60">Available balance</p>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-white/60 transition-colors hover:text-white/80"
            >
              {isBalanceVisible ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-white sm:text-3xl">
              {isBalanceVisible ? (
                <>
                  <span className="text-white/80">$</span>1,000.00
                </>
              ) : (
                <>••••••</>
              )}
            </p>
            <div className="relative inline-block">
              <select className="appearance-none bg-transparent px-1 py-0 pr-5 text-sm font-semibold text-white focus:outline-none [&>option]:bg-brand-5 [&>option]:text-white">
                <option>USD</option>
                <option>BRL</option>
                <option>EUR</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center rounded-[27px] bg-brand-1 text-sm leading-[1.3] text-brand-5 transition-opacity hover:opacity-90 h-10">
              Add funds
            </button>
            <button className="flex flex-1 items-center justify-center rounded-[27px] border border-white/20 bg-white/5 text-sm leading-[1.3] text-white transition-colors hover:bg-white/10 h-10">
              Withdraw funds
            </button>
          </div>
        </div>

        {/* Link Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-1/20 text-brand-1">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white">Link Card</h3>
              <p className="mt-0.5 text-sm text-white/60">
                Clickable card with hover states
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/40" />
          </div>
        </div>

        {/* Address Display */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-medium text-white/80">
            Address Display
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-sm text-white">
                0x1234567890abcdef1234567890abcdef12345678
              </p>
              <p className="mt-1 text-xs text-white/60">0x1234...5678</p>
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-white/70" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Skeletons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Loading States</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-sm font-medium text-white/80">
                Skeleton
              </h3>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-12 w-full" />
              </div>
              <p className="mt-2 text-xs text-white/60">
                animate-pulse rounded-lg bg-white/10
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Feedback States</h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Error message</p>
          </div>
          <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-4">
            <p className="text-sm text-green-400">Success message</p>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Icons (Lucide React)
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 lg:grid-cols-8">
            {[
              { icon: Wallet, name: 'Wallet' },
              { icon: Landmark, name: 'Landmark' },
              { icon: ChevronRight, name: 'ChevronRight' },
              { icon: ChevronLeft, name: 'ChevronLeft' },
              { icon: ChevronDown, name: 'ChevronDown' },
              { icon: Eye, name: 'Eye' },
              { icon: EyeOff, name: 'EyeOff' },
              { icon: Copy, name: 'Copy' },
              { icon: Check, name: 'Check' },
            ].map(({ icon: Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                  <Icon className="h-6 w-6 text-white/70" />
                </div>
                <p className="text-xs text-white/60">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
