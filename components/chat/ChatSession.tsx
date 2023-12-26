'use client'

import { Model } from '@/data/types'
import { ModelSelectBox } from '../ModelSelect/ModelSelectBox'
import { ChatBuffer } from './ChatBuffer'
import { ChatInput } from './ChatInput'
import { useChat } from './useChat'

type ChatSessionProps = {
  models: Model[]
}

export const ChatSession = ({ models }: ChatSessionProps) => {
  const chat = useChat()
  return (
    <>
      <ModelSelectBox models={models} />
      <ChatBuffer messages={chat.messages} />
      <ChatInput />
    </>
  )
}
