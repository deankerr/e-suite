import { createContext, useContext } from 'react'

import { useChatApi } from '@/lib/useChatApi'

type ChatApi = ReturnType<typeof useChatApi>

const ChatPanelApiContext = createContext<ChatApi | undefined>(undefined)

type ChatApiProviderProps = {
  children: React.ReactNode
}

export const ChatPanelApiProvider = ({ children }: ChatApiProviderProps) => {
  const api = useChatApi()
  return <ChatPanelApiContext.Provider value={api}>{children}</ChatPanelApiContext.Provider>
}

export const useChatPanelApi = (): ChatApi => {
  const context = useContext(ChatPanelApiContext)
  if (!context) {
    throw new Error('useChatPanelApi must be used within a ChatPanelApiProvider')
  }
  return context
}
