import type { Id } from '@/convex/_generated/dataModel'
import { atom, PrimitiveAtom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { createContext } from 'react'
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

// const ShellContext = createContext<ReturnType<typeof createShellAtom> | null>(null)

const createShellAtom = () => {
  const valueAtom = atom({ left: false, right: true })
  const interfaceAtom = atom(
    (get) => get(valueAtom),
    (_, set, args: { left: boolean; right: boolean }) => {
      set(valueAtom, args)
    },
  )
  return interfaceAtom
}
