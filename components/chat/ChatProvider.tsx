import { createContext, useContext } from 'react'

import { useCreateChatContextApi } from '@/components/chat/useCreateChatContext'

type ChatContext = ReturnType<typeof useCreateChatContextApi>
const ChatContext = createContext<ChatContext | undefined>(undefined)

export const ChatProvider = ({
  children,
  ...props
}: {
  slug: string
  onClose?: (slug: string) => void
  children: React.ReactNode
}) => {
  const api = useCreateChatContextApi({ slug: props.slug })

  return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>
}

export const useChat = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
