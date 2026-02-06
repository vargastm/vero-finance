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

// Use globalThis to ensure persistence across hot reloads in development
declare global {
  var __withdrawCodes: Map<string, WithdrawCode> | undefined
}

const codes = globalThis.__withdrawCodes ?? new Map<string, WithdrawCode>()

if (!globalThis.__withdrawCodes) {
  globalThis.__withdrawCodes = codes
}

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
  let code = generateConfirmationCode()
  // Ensure code is exactly 6 digits (should already be, but just in case)
  code = code.replace(/\D/g, '').slice(0, 6).padStart(6, '0')

  const now = Date.now()
  const expiresAt = now + CODE_EXPIRY_MINUTES * 60 * 1000

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase()

  // Remove old codes from the same email (normalize for comparison)
  for (const [key, value] of codes.entries()) {
    const storedEmailNormalized = value.email.trim().toLowerCase()
    if (storedEmailNormalized === normalizedEmail) {
      codes.delete(key)
    }
  }

  const withdrawCode: WithdrawCode = {
    code,
    email: email.trim().toLowerCase(), // Normalize email storage
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
  // Normalize inputs - remove any non-numeric characters and trim
  code = code.replace(/\D/g, '').trim()
  email = email.trim().toLowerCase()

  // Check if code is exactly 6 digits
  if (code.length !== 6) {
    return { valid: false, error: 'Code must be 6 digits' }
  }

  const withdrawCode = codes.get(code)

  if (!withdrawCode) {
    return { valid: false, error: 'Invalid code' }
  }

  // Normalize stored email for comparison
  const storedEmail = withdrawCode.email.trim().toLowerCase()
  if (storedEmail !== email) {
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
