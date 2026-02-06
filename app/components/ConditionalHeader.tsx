'use client'

import { usePathname } from 'next/navigation'

import { Header } from './Header'

export function ConditionalHeader() {
  const pathname = usePathname()

  // Don't show header on welcome page
  if (pathname === '/welcome') {
    return null
  }

  return <Header />
}
