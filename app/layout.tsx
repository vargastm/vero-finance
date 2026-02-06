import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

import { ConditionalHeader } from './components/ConditionalHeader'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Vero Finance',
  description: 'International payments for importers and exporters',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
