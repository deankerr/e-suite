import { format } from 'util'
import { clsx, type ClassValue } from 'clsx'
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

export function getRandomName() {
  const names = [
    'Emma Davidson',
    'Doris Starr',
    'Earl Rodgers',
    'Lynette Raynor',
    'Katie Rich',
    'Bonita Joseph',
    'Moses Joyce',
    'Davion Kaplan',
    'Rafael Desai ',
    'Harriet Norman',
    'Lexi Monroe',
    'Brock Graves',
    'Eric Chung',
    'Yvonne Lawrence',
    'Orlaith McKenna',
    'Rogelio Puckett',
    'Jacquelyn Glass',
    'Harriet Blanchard',
  ]

  return shuffle(names)[0]!
}

export function getRandomAgentAvatar() {
  const agentImages = [
    'charon1.jpg',
    'charon2.jpg',
    'charon3.jpg',
    'charon4.jpg',
    'charon5.jpg',
    'charon6.jpg',
    'charon7.jpg',
    'charon8.jpg',
    'charon9.jpg',
    'float1.jpg',
    'float2.jpg',
    'float3.jpg',
    'float4.jpg',
    'float5.jpg',
    'pinata1.jpg',
    'pinata2.jpg',
    'pinata3.jpg',
    'pinata4.jpg',
    'pinata5.jpg',
    'pinata6.jpg',
    'pinata7.jpg',
    'pinata8.jpg',
  ] as const

  return '/agent-avatars/' + shuffle(agentImages)[0]!
}

export function objFormat(obj: unknown) {
  return format('%o', obj)
}
export function logObjFormat(obj: unknown, label?: string) {
  console.log('')
  console.log('=== === === ===')
  label && console.log(label)
  console.log(objFormat(obj))
  console.log('=== === === ===')
  console.log('')
}
