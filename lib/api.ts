import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithPending } from 'jotai-suspense'
import { atomFamily } from 'jotai/utils'
import { useSelectedLayoutSegments } from 'next/navigation'

import { api } from '@/convex/_generated/api'

import type { EGeneratedImage, EMessage, EThread } from '@/convex/external'
import type { UsePaginatedQueryReturnType } from 'convex/react'

const generatedImageAtoms = atomFamily((rid: string) => {
  const atom = atomWithPending<EGeneratedImage>()
  atom.debugLabel = `generatedImage(${rid})`
  return atom
})

export const useGeneratedImage = (rid: string) => useAtomValue(generatedImageAtoms(rid))

const setGeneratedImagesAtom = atom(null, (_, set, images: EGeneratedImage[]) => {
  for (const image of images) {
    set(generatedImageAtoms(image.rid), image)
  }
})

//* messages
const messageAtoms = atomFamily((rid: string) => {
  const atom = atomWithPending<EMessage & { images: EGeneratedImage[] }>()
  atom.debugLabel = `message(${rid})`
  return atom
})
const setMessagesAtom = atom(
  null,
  (_, set, messages: Array<EMessage & { images: EGeneratedImage[] }>) => {
    for (const message of messages) {
      set(messageAtoms(message.rid), message)
    }
  },
)

export const useMessage = (rid: string) => {
  const message = useAtomValue(messageAtoms(rid))
  return message
}

export const useMessageToAtom = (rid?: string) => {
  const result = useQuery(api.ext.messages.get, rid ? { rid } : 'skip')
  const message = result?.message
  const images = result?.images

  const setMessage = useSetAtom(messageAtoms(rid ?? ''))
  const setImages = useSetAtom(setGeneratedImagesAtom)

  useEffect(() => {
    if (!(message && images)) return
    setMessage({ ...message, images })
    setImages(images)
  }, [images, message, setImages, setMessage])
}

//* threads
type ThreadWithPager = EThread & {
  pager: UsePaginatedQueryReturnType<typeof api.ext.threads.messages>
  messages: string[]
}
const threadAtoms = atomFamily((rid: string) => {
  const atom = atomWithPending<ThreadWithPager>()
  atom.debugLabel = `thread(${rid})`
  return atom
})

export const useThread = (rid: string) => {
  const thread = useAtomValue(threadAtoms(rid))
  return thread
}

export const useThreadCtx = () => {
  const segments = useSelectedLayoutSegments()
  const [_, rid] = segments
  const thread = useAtomValue(threadAtoms(rid ?? ''))
  return thread
}

export const useLoadThread = (rid?: string) => {
  const thread = useQuery(api.ext.threads.get, rid ? { rid } : 'skip')
  const pager = usePaginatedQuery(
    api.ext.threads.messages,
    thread ? { threadId: thread._id } : 'skip',
    { initialNumItems: 5 },
  )

  const setThread = useSetAtom(threadAtoms(thread?.rid ?? ''))
  const setMessages = useSetAtom(setMessagesAtom)

  useEffect(() => {
    if (!thread) return
    setMessages(pager.results)
    setThread({ ...thread, pager, messages: pager.results.map(({ rid }) => rid) })
  }, [pager, setMessages, setThread, thread])
}

//* non-atom queries
export const useModelList = (skip?: 'skip') => {
  const models = useQuery(api.models.list, skip ?? {})
  return models
}

export const useDashboardTemp = () => {
  const self = useQuery(api.users.getSelf, {})

  const threads = usePaginatedQuery(api.ext.threads.list, {}, { initialNumItems: 20 })
  const createThread = useMutation(api.threads.create)
  const removeThread = useMutation(api.threads.remove)

  const userAuth = useUser()

  return { self, threads: threads.results, createThread, removeThread, userAuth }
}
