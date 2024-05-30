import { atom } from 'jotai'
import { atomWithStorage, splitAtom } from 'jotai/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

export const allAvailableThreadsAtom = atom<EThreadWithContent[]>([])
export const availableThreadsAtoms = splitAtom(allAvailableThreadsAtom)

export const threadsPageStateAtom = atomWithStorage<string[]>('e-threads-page-state', [])

export const threadDeckAtoms = atom<EThreadWithContent[]>([])
export const threadDeckSplitAtom = splitAtom(threadDeckAtoms, (thread) => thread._id)
