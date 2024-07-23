import { atom } from 'jotai'

import { RunConfig } from '@/convex/db/threadsB'

import type { ShellPage } from '@/components/shell/Shell'
import type { EChatModel, EImageModel, InferenceConfig } from '@/convex/types'

export const shellOpenAtom = atom<boolean>(false)
export const shellStackAtom = atom<ShellPage[]>([])
export const shellSearchValueAtom = atom<string>('')
export const shellSelectedThreadIdAtom = atom<string | null>(null)
export const shellThreadTitleValueAtom = atom<string>('')
export const shellSelectedModelAtom = atom<EChatModel | EImageModel | null>(null)
export const shellNewThreadRunConfig = atom<RunConfig | null>(null)
export const shellNewThreadInferenceConfig = atom<InferenceConfig | null>(null)
