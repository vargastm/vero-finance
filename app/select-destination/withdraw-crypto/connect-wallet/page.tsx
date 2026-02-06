'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import { BackButton } from '@/app/components/BackButton'

export default function ConnectWalletPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [userChoseWallet, setUserChoseWallet] = useState(false)

  // Disconnect when entering the page to force wallet selection
  useEffect(() => {
    // Always disconnect when entering the page, even if already connected
    if (isConnected && !userChoseWallet) {
      disconnect()
    }
  }, [isConnected, disconnect, userChoseWallet])

  const handleContinue = () => {
    if (isConnected) {
      router.push('/select-destination/withdraw-crypto/select-network')
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col px-4 pb-8 pt-6 sm:px-6 lg:max-w-7xl lg:px-8">
      <div>
        <div className="mb-6 flex items-center gap-3">
          <BackButton href="/select-destination" />
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Connect Wallet
          </h1>
        </div>
        <p className="text-base text-white/70 sm:text-lg">
          Connect your wallet to start withdrawing cryptocurrency.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-brand-1/5 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading'
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated')

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        // Always show connect button if not connected or if user hasn't chosen wallet yet
                        if (!connected || !userChoseWallet) {
                          return (
                            <div className="flex flex-col items-center gap-6">
                              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-brand-1/20 to-brand-1/10">
                                <Wallet className="h-10 w-10 text-brand-1" />
                              </div>
                              <div className="space-y-2">
                                <p className="text-base font-medium text-white sm:text-lg">
                                  Connect your wallet
                                </p>
                                <p className="text-sm text-white/60">
                                  Choose from Phantom, MetaMask, or other
                                  supported wallets
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setUserChoseWallet(true)
                                  openConnectModal()
                                }}
                                type="button"
                                className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-brand-1 to-brand-1/90 px-6 py-4 text-base font-semibold text-brand-5 shadow-lg shadow-brand-1/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-1/30 active:scale-[0.98]"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  <Wallet className="h-5 w-5" />
                                  Connect Wallet
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                              </button>
                            </div>
                          )
                        }

                        if (chain.unsupported) {
                          return (
                            <div className="flex flex-col items-center gap-6">
                              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                                  <span className="text-2xl">⚠️</span>
                                </div>
                              </div>
                              <div className="space-y-2 text-center">
                                <p className="text-base font-semibold text-red-400">
                                  Unsupported Network
                                </p>
                                <p className="text-sm text-white/60">
                                  Please switch to a supported network to
                                  continue
                                </p>
                              </div>
                              <button
                                onClick={openChainModal}
                                type="button"
                                className="w-full rounded-2xl border-2 border-red-500/50 bg-red-500/10 px-6 py-4 text-base font-semibold text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/70"
                              >
                                Switch Network
                              </button>
                            </div>
                          )
                        }

                        // Only show "Continue" if user chose wallet through the modal
                        if (!userChoseWallet) {
                          return (
                            <div className="flex flex-col items-center gap-6">
                              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-brand-1/20 to-brand-1/10">
                                <Wallet className="h-10 w-10 text-brand-1" />
                              </div>
                              <div className="space-y-2">
                                <p className="text-base font-medium text-white sm:text-lg">
                                  Connect your wallet
                                </p>
                                <p className="text-sm text-white/60">
                                  Choose from Phantom, MetaMask, or other
                                  supported wallets
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setUserChoseWallet(true)
                                  openConnectModal()
                                }}
                                type="button"
                                className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-brand-1 to-brand-1/90 px-6 py-4 text-base font-semibold text-brand-5 shadow-lg shadow-brand-1/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-1/30 active:scale-[0.98]"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  <Wallet className="h-5 w-5" />
                                  Connect Wallet
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                              </button>
                            </div>
                          )
                        }

                        return (
                          <div className="flex flex-col gap-5">
                            <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-5 backdrop-blur-sm">
                              <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-1/20">
                                  <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <p className="text-xs font-medium uppercase tracking-wider text-brand-1">
                                  Connected
                                </p>
                              </div>
                              <p className="truncate text-lg font-semibold text-white">
                                {account.displayName}
                              </p>
                              <p className="mt-1 text-sm text-white/60">
                                {chain.name}
                              </p>
                            </div>
                            <button
                              onClick={handleContinue}
                              type="button"
                              className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-brand-1 to-brand-1/90 px-6 py-4 text-base font-semibold text-brand-5 shadow-lg shadow-brand-1/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-1/30 active:scale-[0.98]"
                            >
                              <span className="relative z-10">Continue</span>
                              <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </button>
                            <button
                              onClick={() => {
                                setUserChoseWallet(false)
                                openAccountModal()
                              }}
                              type="button"
                              className="w-full rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-base font-medium text-white transition-all hover:border-white/30 hover:bg-white/10"
                            >
                              Change Wallet
                            </button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
