'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

const BALANCE_STORAGE_KEY = 'vero_balance_usdc'
const DEFAULT_BALANCE = 1250.5

interface BalanceContextType {
  balance: number
  subtractBalance: (amount: number) => void
  addBalance: (amount: number) => void
  resetBalance: () => void
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(DEFAULT_BALANCE)

  // Load balance from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedBalance = localStorage.getItem(BALANCE_STORAGE_KEY)
    if (storedBalance) {
      const parsedBalance = parseFloat(storedBalance)
      if (!isNaN(parsedBalance) && parsedBalance >= 0) {
        setBalance(parsedBalance)
      }
    }
  }, [])

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(BALANCE_STORAGE_KEY, balance.toString())
  }, [balance])

  const subtractBalance = (amount: number) => {
    setBalance((prev) => {
      const newBalance = Math.max(0, prev - amount)
      return newBalance
    })
  }

  const addBalance = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  const resetBalance = () => {
    setBalance(DEFAULT_BALANCE)
  }

  return (
    <BalanceContext.Provider
      value={{ balance, subtractBalance, addBalance, resetBalance }}
    >
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider')
  }
  return context
}
