import type { Id } from '@/convex/_generated/dataModel'
import { atom, PrimitiveAtom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { createContext, useContext } from 'react'
import { useThread } from '../threads/useThread'

const threadAtomFamily = atomFamily(
  ({
    threadId,
    convexAtom,
  }: {
    threadId: Id<'threads'>
    convexAtom: PrimitiveAtom<ReturnType<typeof useThread>>
  }) => atom({ threadId, convexAtom }),
  (a, b) => a.threadId === b.threadId,
)

export const useThreadAtomFamily = ({ threadId }: { threadId: Id<'threads'> }) => {
  const convexAtom = atom(useThread({ id: threadId }))
  const threadFamilyAtom = threadAtomFamily({ threadId, convexAtom })
  return useAtom(threadFamilyAtom)
}

//* Shell

export const sidebarConfigWidths = [256, 288, 320, 384] as const

const defaultShellAtom = {
  leftOpen: false,
  leftFloating: false,
  leftWidth: 256,
  rightOpen: true,
  rightFloating: false,
  rightWidth: 256,
}

type ShellAtomConfig = typeof defaultShellAtom & {
  leftWidth: (typeof sidebarConfigWidths)[number]
  rightWidth: (typeof sidebarConfigWidths)[number]
}

export const createShellContextAtom = (initial?: Partial<ShellAtomConfig>) => {
  const valueAtom = atom({ ...defaultShellAtom, ...initial })

  const interfaceAtom = atom(
    (get) => get(valueAtom),
    (get, set, values: Partial<ShellAtomConfig>) => {
      set(valueAtom, { ...get(valueAtom), ...values })
    },
  )
  return interfaceAtom
}

export const ShellContext = createContext<ReturnType<typeof createShellContextAtom> | null>(null)

export const useShellContext = () => {
  const context = useContext(ShellContext)
  if (!context) throw new Error('useShellContext called outside of provider')
  return useAtom(context)
}
