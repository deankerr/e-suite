import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithPending } from 'jotai-suspense'
import { atomFamily } from 'jotai/utils'

import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'
import type { Message as MessageEnt, Thread } from '@/convex/external'

const userThreadsListCacheAtom = atom<Thread[]>([])

export const useUserEntities = () => {
  const threads = useQuery(api.frontend.listThreads, {})
  const set = useSetAtom(userThreadsListCacheAtom)
  useEffect(() => {
    if (threads) set(threads)
  }, [set, threads])
}

export const useUserThreadsList = () => useAtomValue(userThreadsListCacheAtom)

//TODO will re-render on any thread update
export const useThread = (rid: string) => {
  const threads = useAtomValue(userThreadsListCacheAtom)
  const thread = threads.find((thread) => thread.rid === rid)

  return thread
}

export const useGetMessageNaive = (messageId: Id<'messages'>) => {
  const message = useQuery(api.frontend.getMessage, { messageId })
  return message
}

const messageCacheAtomFamily = atomFamily((id: Id<'messages'>) => {
  return atomWithPending<MessageEnt>()
})

export const useGetMessageSuspense = (messageId: Id<'messages'>) => {
  const message = useAtomValue(messageCacheAtomFamily(messageId))
  return message
}

export const useSetMessageCache = (message: MessageEnt) => {
  const setter = useSetAtom(messageCacheAtomFamily(message._id))
  return {
    setCache: (message: MessageEnt) => {
      setter(message)
    },
  }
}

export const useThreadMessageSuspenseList = ({ threadId }: { threadId: Id<'threads'> }) => {
  const messages = useQuery(api.frontend.listThreadMessages, { threadId })
}
