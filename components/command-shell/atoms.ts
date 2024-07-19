import { atom } from 'jotai'

import type { ShellMenuPageName } from '@/components/command-shell/Shell'

export const shellOpenAtom = atom(false)
export const shellStackAtom = atom<ShellMenuPageName[]>([])
