// Temporary storage for confirmation codes

interface WithdrawCode {
  code: string
  email: string
  amount: number
  currencyCode: string
  createdAt: number
  expiresAt: number
  attempts: number
}

const codes = new Map<string, WithdrawCode>()

const CODE_EXPIRY_MINUTES = 10 // Code expires in 10 minutes
const MAX_ATTEMPTS = 3 // Maximum of 3 attempts

/**
 * Generates a 6-digit confirmation code
 */
export function generateConfirmationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Creates and stores a confirmation code
 */
export function createWithdrawCode(
  email: string,
  amount: number,
  currencyCode: string,
): string {
  const code = generateConfirmationCode()
  const now = Date.now()
  const expiresAt = now + CODE_EXPIRY_MINUTES * 60 * 1000

  // Remove old codes from the same email
  for (const [key, value] of codes.entries()) {
    if (value.email === email) {
      codes.delete(key)
    }
  }

  const withdrawCode: WithdrawCode = {
    code,
    email,
    amount,
    currencyCode,
    createdAt: now,
    expiresAt,
    attempts: 0,
  }

  codes.set(code, withdrawCode)

  // Clean up expired codes periodically
  setTimeout(
    () => {
      codes.delete(code)
    },
    CODE_EXPIRY_MINUTES * 60 * 1000,
  )

  return code
}

/**
 * Validates a confirmation code
 */
export function validateWithdrawCode(
  code: string,
  email: string,
): { valid: boolean; error?: string; withdrawData?: WithdrawCode } {
  const withdrawCode = codes.get(code)

  if (!withdrawCode) {
    return { valid: false, error: 'Invalid code' }
  }

  if (withdrawCode.email !== email) {
    return { valid: false, error: 'Code does not match email' }
  }

  if (Date.now() > withdrawCode.expiresAt) {
    codes.delete(code)
    return { valid: false, error: 'Code expired' }
  }

  withdrawCode.attempts += 1

  if (withdrawCode.attempts > MAX_ATTEMPTS) {
    codes.delete(code)
    return { valid: false, error: 'Too many attempts. Invalid code.' }
  }

  // Valid code - remove after successful validation
  codes.delete(code)

  return { valid: true, withdrawData: withdrawCode }
}

/**
 * Cleans up expired codes (can be called periodically)
 */
export function cleanupExpiredCodes(): void {
  const now = Date.now()
  for (const [code, withdrawCode] of codes.entries()) {
    if (now > withdrawCode.expiresAt) {
      codes.delete(code)
    }
  }
}
