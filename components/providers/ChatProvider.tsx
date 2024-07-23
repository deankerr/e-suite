import { createContext, useContext } from 'react'

import { useCreateChatContext } from '@/components/providers/chat-context'

export type ChatContext = ReturnType<typeof useCreateChatContext>
const ChatContext = createContext<ChatContext | undefined>(undefined)

export const ChatProvider = ({
  children,
  ...props
}: {
  slug: string
  series?: string

  children: React.ReactNode
}) => {
  const api = useCreateChatContext({ slug: props.slug, series: props.series })

  return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>
}

export const useChat = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
