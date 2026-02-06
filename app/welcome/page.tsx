'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { saveUserData } from '../lib/user'

export default function WelcomePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleStart = () => {
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validations
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setIsSubmitting(true)

    // Save to localStorage
    try {
      saveUserData({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })

      // Redirect to main page
      router.push('/')
    } catch (err) {
      setError('Error saving data. Please try again.')
      setIsSubmitting(false)
      console.error('Error saving data:', err)
    }
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden">
      {/* Decorative gradient background - covers full screen */}
      <div className="fixed inset-0 bg-linear-to-br from-brand-1/10 via-brand-1/5 to-transparent" />

      {/* Hero Section with Gradient */}
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col lg:max-w-7xl lg:px-8">
        <div className="relative flex flex-1 flex-col justify-between px-6 pb-8 pt-12">
          {/* Content area */}
          <div className="flex flex-1 flex-col items-center justify-start">
            {/* Logo - always visible, never changes */}
            <div className="mb-12 flex h-64 w-64 items-center justify-center rounded-full bg-linear-to-br from-brand-1/20 via-brand-1/15 to-brand-1/10 backdrop-blur-sm">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-linear-to-br from-brand-1/30 to-brand-1/20">
                <img
                  src="https://pbs.twimg.com/profile_images/2014568638636871680/-PGdE3kH_400x400.jpg"
                  alt="Vero Finance"
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Content area below logo - text and form share the same space */}
            <div
              className="relative w-full max-w-md"
              style={{ minHeight: '180px' }}
            >
              {/* Welcome text section */}
              {!showForm && (
                <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500">
                  <h1 className="mb-4 text-center text-3xl font-bold leading-tight text-white sm:text-4xl">
                    A financial world
                    <br />
                    without complexities
                  </h1>
                  <p className="text-center text-base text-white/70 sm:text-lg">
                    Simple, fast, and secure international payments
                  </p>
                </div>
              )}
              {/* Form section - appears in the same position */}
              {showForm && (
                <div className="inset-0 flex flex-col items-center justify-center transition-opacity duration-500">
                  <div className="w-full">
                    <h2 className="mb-8 text-center text-2xl font-semibold text-white sm:text-3xl">
                      Let&apos;s get started
                    </h2>

                    {error && (
                      <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-3">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          autoComplete="off"
                          onChange={(e) => {
                            setName(e.target.value)
                            setError(null)
                          }}
                          placeholder="Your full name"
                          disabled={isSubmitting}
                          className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 px-5 text-base text-white placeholder:text-white/50 focus:border-brand-1 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand-1/50 disabled:opacity-50"
                          aria-label="Name"
                        />
                      </div>

                      <div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          autoComplete="off"
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError(null)
                          }}
                          placeholder="your@email.com"
                          disabled={isSubmitting}
                          className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 px-5 text-base text-white placeholder:text-white/50 focus:border-brand-1 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand-1/50 disabled:opacity-50"
                          aria-label="Email"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !name.trim() || !email.trim()}
                        className="mt-6 flex w-full items-center justify-center rounded-2xl bg-brand-1 px-6 py-4 text-base font-semibold text-brand-5 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-brand-1/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                      >
                        {isSubmitting ? 'Entering...' : 'Continue'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom section with CTA - maintain space to prevent layout shift */}
          {!showForm && (
            <div className="mt-8 h-[60px]">
              <button
                type="button"
                onClick={handleStart}
                className="flex w-full items-center justify-center rounded-2xl bg-brand-1 px-6 py-4 text-base font-semibold text-brand-5 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-brand-1/20 active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
