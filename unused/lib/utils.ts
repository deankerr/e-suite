import { customAlphabet } from 'nanoid/non-secure'
import { shuffle } from 'remeda'
import avatarList from './avatars.json'
import namesList from './names.json'

export function raise(message: string): never {
  throw new Error(message)
}

export function invariant<T>(condition: T, message?: string): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
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
