'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { WagmiProvider } from 'wagmi'
import { http } from 'wagmi'
import { arbitrum, base, mainnet, polygon, sepolia } from 'wagmi/chains'

import { BalanceProvider } from './contexts/BalanceContext'

const config = getDefaultConfig({
  appName: 'Vero Finance',
  projectId: 'vero-finance',
  chains: [mainnet, polygon, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: '#f9c438',
            accentColorForeground: '#050b12',
            borderRadius: 'large',
          })}
          appInfo={{
            appName: 'Vero Finance',
          }}
        >
          <BalanceProvider>{children}</BalanceProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
