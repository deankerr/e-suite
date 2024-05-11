import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithPending } from 'jotai-suspense'
import { atomFamily } from 'jotai/utils'

import type { api } from '@/convex/_generated/api'
import type { MessageContent, Thread } from '@/convex/external'
import type { UsePaginatedQueryReturnType } from 'convex/react'

export const messageContentAtoms = atomFamily((rid: string) => {
  const a = atomWithPending<MessageContent>()
  a.debugLabel = `messageContentAtom(${rid})`
  return a
})

export const useMessage = (rid: string) => useAtomValue(messageContentAtoms(rid))

const messagesSetterAtom = atom(null, (get, set, messages: MessageContent[]) => {
  for (const message of messages) {
    set(messageContentAtoms(message.message.rid), message)
  }
})
export const useMessagesSetter = () => useSetAtom(messagesSetterAtom)

export type ThreadPager = {
  thread: Thread
  pager: UsePaginatedQueryReturnType<typeof api.threads.messages>
  messageRids: string[]
}

export const threadAtoms = atomFamily((rid: string) => {
  const a = atomWithPending<ThreadPager>()
  a.debugLabel = `threadAtom(${rid})`
  return a
})
export const useThread = (rid: string) => useAtomValue(threadAtoms(rid))
