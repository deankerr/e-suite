import { atom } from 'jotai'
import { splitAtom } from 'jotai/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

export const globalMenuOpenAtom = atom(false)

export const threadDeckAtoms = atom<EThreadWithContent[]>([])
export const threadDeckSplitAtom = splitAtom(threadDeckAtoms, (thread) => thread._id)
