import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { atomWithToggleAndStorage } from '@/lib/utils'

export const commandMenuOpenAtom = atom(false)

export const chatDeckAtom = atomWithStorage<string[]>('chat-deck', [])

export const showSidebarAtom = atomWithToggleAndStorage('show-sidebar', false)

export const voiceoverQueueAtom = atom<string[]>([])
export const voiceoverAutoplayThreadIdAtom = atom('')

export const loadMaxAtom = atomWithStorage<number>('load-max', 25)
