import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const commandMenuOpenAtom = atom(false)

export const chatDeckAtom = atomWithStorage<string[]>('chat-deck', [])
