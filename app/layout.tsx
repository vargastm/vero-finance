import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

import { ConditionalHeader } from './components/ConditionalHeader'

export const metadata: Metadata = {
  title: 'Vero Finance',
  description: 'International payments for importers and exporters',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  )
}
