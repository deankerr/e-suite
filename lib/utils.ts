import avatarList from '@/config/avatars.json'
import namesList from '@/config/names.json'
import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid/non-secure'
import { shuffle } from 'remeda'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function raise(message: string): never {
  throw new Error(message)
}

export function invariant<T>(condition: T, message?: string): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

export function _deprecated_env(key: string, fallback?: string) {
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

export function dollarsToNanoUSD(dollars: number) {
  return (dollars / 4000) * 1_000_000_000
}

export function nanoUSDToDollars(nano: number) {
  return (nano * 4000) / 1_000_000_000
}

const rndAlpha = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
const rndNum = customAlphabet('0123456789')
const rndId = () => shuffle([rndAlpha(1), rndNum(1), rndNum(1)]).join('')

export function getRandomName() {
  return shuffle(namesList)[0]! + '-' + rndId()
}

export function getRandomAgentAvatar() {
  return '/agent-avatars/' + shuffle(avatarList)[0]!
}

export function truncateFloat(value: string | number, precision = 12) {
  const n = typeof value === 'string' ? parseFloat(value) : value
  return Number(n.toFixed(precision))
}
