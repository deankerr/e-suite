import React, { createContext, useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'

import { useUpdateMessage } from '@/app/lib/api/threads'
import { useViewer } from '@/app/lib/api/users'

import type { MessageFeedContext } from '../chat/panels/MessageFeed2'
import type { EMessage } from '@/convex/types'

type EMessageUpdate = { role: EMessage['role']; name: EMessage['name']; text: EMessage['text'] }

type MessageContextType = {
  message: EMessage
  context?: MessageFeedContext
  isEditing: boolean
  showJson: boolean
  textStyle: 'markdown' | 'monospace'
  viewerCanEdit: boolean
  setIsEditing: (value: boolean) => void
  setShowJson: (value: boolean) => void
  setTextStyle: (value: 'markdown' | 'monospace') => void
  updateMessage: (fields: EMessageUpdate) => Promise<void>
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({
  children,
  message,
  context,
}: {
  children: React.ReactNode
  message: EMessage
  context?: MessageFeedContext
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [textStyle, setTextStyle] = useState<'markdown' | 'monospace'>('markdown')

  const sendUpdateMessage = useUpdateMessage()
  const updateMessage = useCallback(
    async ({ role, name, text }: EMessageUpdate) => {
      try {
        await sendUpdateMessage({
          messageId: message._id,
          role,
          name,
          text,
        })
        setIsEditing(false)
        toast.success('Message updated')
      } catch (error) {
        toast.error('Failed to update message')
        console.error('Error updating message:', error)
      }
    },
    [message._id, sendUpdateMessage],
  )

  const { isViewer: viewerCanEdit } = useViewer(message.userId)

  const value = {
    message,
    context,
    isEditing,
    showJson,
    textStyle,
    viewerCanEdit,
    setIsEditing,
    setShowJson,
    setTextStyle,
    updateMessage,
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
