import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from 'react-use'

import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { useMessages, useThread } from '@/lib/queries'

import type { EThread } from '@/convex/shared/types'

const configUseChatDeck = false

const useChatContextApi = ({
  slug,
  onClose,
}: {
  slug: string
  onClose?: (slug: string) => void
}) => {
  const router = useRouter()
  const [localThread, setLocalThread, removeLocalThread] = useLocalStorage<EThread>(
    `chat-${slug}`,
    {
      _id: '',
      slug,
      _creationTime: 0,
      updatedAtTime: 0,
      userId: '',
      config: {
        ui: slug === '_image' ? defaultImageInferenceConfig : defaultChatInferenceConfig,
        saved: [],
      },
      title: slug === '_image' ? 'New Generation' : 'New Chat',
    },
  )

  const [currentId, setCurrentId] = useState(slug)
  const { data: queriedThread } = useThread(currentId)

  const thread = currentId.startsWith('_') ? localThread : queriedThread
  const messages = useMessages(thread?._id)

  const createMessage = useMutation(api.db.messages.create)
  const apiRemoveMessage = useMutation(api.db.messages.remove)
  const run = useMutation(api.db.messages.run)
  const updateThread = useMutation(api.db.threads.update)
  const updateMessage = useMutation(api.db.messages.update)

  const sendMessage = useCallback(
    async (args: Omit<Parameters<typeof createMessage>[0], 'threadId'>) => {
      if (!thread) return
      const { threadId: newThreadId, slug: newSlug } = await createMessage({
        ...args,
        threadId: thread._id,
      })

      if (newThreadId !== thread._id) {
        removeLocalThread()
        if (configUseChatDeck) setCurrentId(newThreadId)
        else router.push(`/c/${newSlug}`)
      }
    },
    [thread, createMessage, removeLocalThread, router],
  )

  const removeMessage = useCallback(
    async (messageId: string) => {
      await apiRemoveMessage({ messageId })
    },
    [apiRemoveMessage],
  )

  const runInference = useCallback(
    async (args: Omit<Parameters<typeof run>[0], 'threadId'>) => {
      if (!thread) return
      const { threadId: newThreadId, slug: newSlug } = await run({
        ...args,
        threadId: thread._id,
      })

      if (newThreadId !== thread._id) {
        removeLocalThread()
        if (configUseChatDeck) setCurrentId(newThreadId)
        else router.push(`/c/${newSlug}`)
      }
    },
    [thread, run, removeLocalThread, router],
  )

  const updateThreadConfig = useCallback(
    async (args: Omit<Parameters<typeof updateThread>[0], 'threadId'>['fields']) => {
      if (!thread) return
      if (currentId.startsWith('_')) {
        setLocalThread((prev) => (prev ? { ...prev, ...args } : undefined))
        return
      }

      await updateThread({ threadId: thread._id, fields: args })
    },
    [currentId, thread, setLocalThread, updateThread],
  )

  const updateMessageContent = useCallback(
    async (args: Parameters<typeof updateMessage>[0]) => {
      await updateMessage(args)
    },
    [updateMessage],
  )

  const closeChat = useCallback(() => {
    if (onClose) onClose(slug)
    router.push('/c')
  }, [onClose, router, slug])

  return {
    thread: useMemo(() => thread, [thread]),
    messages: useMemo(() => messages, [messages]),
    sendMessage,
    removeMessage,
    runInference,
    updateThreadConfig,
    updateMessageContent,
    closeChat,
  }
}

type ChatContext = ReturnType<typeof useChatContextApi>
const ChatContext = createContext<ChatContext | undefined>(undefined)

export const ChatProvider = ({
  children,
  ...props
}: {
  slug: string
  onClose?: (slug: string) => void
  children: React.ReactNode
}) => {
  const api = useChatContextApi(props)

  return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>
}

export const useChat = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
