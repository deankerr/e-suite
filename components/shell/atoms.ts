import { atom } from 'jotai'

import { EModel, EThread } from '@/convex/types'

import type { ShellPage } from '@/components/shell/Shell'

export const shellOpenAtom = atom<boolean>(false)
export const shellStackAtom = atom<ShellPage[]>([])
export const shellSearchValueAtom = atom<string>('')
export const shellSelectedThreadIdAtom = atom<string | null>(null)
export const shellThreadTitleValueAtom = atom<string>('')
export const shellSelectedModelAtom = atom<EModel | null>(null)
