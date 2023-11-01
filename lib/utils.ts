import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function raise(message: string): never {
  throw new Error(message)
}

export function env(key: string, fallback?: string) {
  return process.env[key] ?? fallback ?? raise(`${key} not provided`)
}

export function getLocalStorage() {
  if (!isLocalStorageAvailable()) return undefined
  return window.localStorage
}

function isLocalStorageAvailable() {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem('__e/suite_test_local__', 'doot')
    localStorage.removeItem('__e/suite_test_local__')
    return true
  } catch (e) {
    return false
  }
}
