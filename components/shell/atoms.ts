import { atom } from 'jotai'

import type { ShellPage } from '@/components/shell/Shell'

export const shellOpenAtom = atom<boolean>(false)
export const shellStackAtom = atom<ShellPage[]>([])
export const shellSearchValueAtom = atom<string>('')
export const shellThreadIdAtom = atom<string | null>(null)
export const shellThreadTitleValueAtom = atom<string>('')
