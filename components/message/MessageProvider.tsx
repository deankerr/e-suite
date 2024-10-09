import React, { createContext, useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'

import { useUpdateMessage } from '@/app/lib/api/threads'

import type { EMessage } from '@/convex/types'

type MessageContextType = {
  message: EMessage | null
  isEditing: boolean
  showJson: boolean
  textStyle: 'markdown' | 'monospace'
  setIsEditing: (value: boolean) => void
  setShowJson: (value: boolean) => void
  setTextStyle: (value: 'markdown' | 'monospace') => void
  updateMessageText: (newText: string) => Promise<void>
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({
  children,
  initialMessage,
}: {
  children: React.ReactNode
  initialMessage: EMessage | null
}) {
  const [message, setMessage] = useState<EMessage | null>(initialMessage)
  const [isEditing, setIsEditing] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [textStyle, setTextStyle] = useState<'markdown' | 'monospace'>('markdown')

  const updateMessage = useUpdateMessage()

  const updateMessageText = useCallback(
    async (newText: string) => {
      if (!message) return

      try {
        await updateMessage({
          messageId: message._id,
          role: message.role,
          name: message.name,
          text: newText,
        })
        setMessage({ ...message, text: newText })
        toast.success('Message updated')
      } catch (error) {
        toast.error('Failed to update message')
        console.error('Error updating message:', error)
      }
    },
    [message, updateMessage],
  )

  const value = {
    message,
    isEditing,
    showJson,
    textStyle,
    setIsEditing,
    setShowJson,
    setTextStyle,
    updateMessageText,
  }

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export function useMessageContext() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return context
}
