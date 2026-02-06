import { NextResponse } from 'next/server'

import { validateWithdrawCode } from '../lib/withdraw-codes'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, email } = body

    // Basic validation
    if (!code || !email) {
      return NextResponse.json(
        { error: 'Code and email are required' },
        { status: 400 },
      )
    }

    // Validate code
    const validation = validateWithdrawCode(code, email)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid code' },
        { status: 400 },
      )
    }

    // Valid code - return success
    return NextResponse.json(
      {
        success: true,
        message: 'Code validated successfully',
        withdrawData: {
          amount: validation.withdrawData?.amount,
          currencyCode: validation.withdrawData?.currencyCode,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error validating code:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    )
  }
}
