'use client'

import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { _sampleMessages } from './_sampleMessages'
import { HeaderBar } from './components/HeaderBar'
import { InputPanel } from './components/InputPanel'
import { MessagePanel } from './components/MessagePanel'

export type ChatMessage = Message

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    initialMessages,
    body: {
      model: 'gpt-4',
      provider: 'openai',
      // model: 'nousresearch/nous-hermes-llama2-13b',
      // provider: 'openrouter',
      stream: true,
    },
  })

  const addDebugMessages = () => {
    const newMessages: ChatMessage[] = [...messages, ..._sampleMessages]
    setMessages(newMessages)
  }

  const clearMessages = () => {
    setMessages(initialMessages)
  }

  return (
    <>
      <div className="mx-auto flex h-full max-w-5xl flex-col justify-between bg-base-100 pt-3">
        <HeaderBar addMessages={addDebugMessages} clearMessages={clearMessages} />
        <MessagePanel messages={messages} />
        <InputPanel
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
        />
      </div>
    </>
  )
}

function createChatMessage(
  messageProps: Partial<ChatMessage> & Pick<ChatMessage, 'role' | 'content'>,
): ChatMessage {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)
  const message = { id: nanoid(), ...messageProps }
  return message
}

const initialMessages = [
  createChatMessage({ role: 'system', content: 'You are a helpful AI assistant.' }),
]
