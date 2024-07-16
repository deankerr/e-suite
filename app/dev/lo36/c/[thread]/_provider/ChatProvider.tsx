import { createContext, useContext } from 'react'

import { useCreateChatContext } from '@/app/dev/lo36/c/[thread]/_provider/chat-context'

type ChatContext = ReturnType<typeof useCreateChatContext>
const ChatContext = createContext<ChatContext | undefined>(undefined)

export const ChatProvider = ({
  children,
  ...props
}: {
  slug: string
  onClose?: (slug: string) => void
  children: React.ReactNode
}) => {
  const api = useCreateChatContext({ slug: props.slug })

  return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>
}

export const useChat = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
