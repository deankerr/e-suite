import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const commandMenuOpenAtom = atom(false)

export const threadDeckIdsAtom = atomWithStorage<string[]>('e-thread-deck-ids', [])
