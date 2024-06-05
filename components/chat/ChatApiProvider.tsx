import { createContext, useContext } from 'react'

import { useChatApi } from '@/lib/useChatApi'

type ChatApi = ReturnType<typeof useChatApi>

const ChatViewApiContext = createContext<ChatApi | undefined>(undefined)

type ChatViewApiProviderProps = {
  threadId: string
  children: React.ReactNode
}

export const ChatViewApiProvider = ({ threadId, children }: ChatViewApiProviderProps) => {
  const api = useChatApi(threadId)
  return <ChatViewApiContext.Provider value={api}>{children}</ChatViewApiContext.Provider>
}

export const useChatViewApi = (): ChatApi => {
  const context = useContext(ChatViewApiContext)
  if (!context) {
    throw new Error('useChatPanelApi must be used within a ChatPanelApiProvider')
  }
  return context
}
