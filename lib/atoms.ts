import { atom } from 'jotai'

import { EThread } from '@/convex/external'

export const activeThreadAtom = atom<EThread | null | undefined>(undefined)
