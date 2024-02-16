import type { Id } from '@/convex/_generated/dataModel'
import { atom, PrimitiveAtom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
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

export const createShellAtom = () => atom({ left: { x: 0 }, main: { width: 100 }, right: { x: 0 } })
