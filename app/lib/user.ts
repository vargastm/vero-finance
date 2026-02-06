/**
 * Utilities for managing user data
 */

const USER_NAME_KEY = 'vero_user_name'
const USER_EMAIL_KEY = 'vero_user_email'

export interface UserData {
  name: string
  email: string
}

/**
 * Checks if the user has already filled in the required data
 */
export function hasUserData(): boolean {
  if (typeof window === 'undefined') return false

  const name = localStorage.getItem(USER_NAME_KEY)
  const email = localStorage.getItem(USER_EMAIL_KEY)

  return !!(name && email)
}

/**
 * Gets the user data
 */
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null

  const name = localStorage.getItem(USER_NAME_KEY)
  const email = localStorage.getItem(USER_EMAIL_KEY)

  if (!name || !email) return null

  return { name, email }
}

/**
 * Saves the user data
 */
export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(USER_NAME_KEY, data.name)
  localStorage.setItem(USER_EMAIL_KEY, data.email.toLowerCase())
}

/**
 * Removes the user data
 */
export function clearUserData(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(USER_NAME_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
}
