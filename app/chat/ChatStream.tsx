'use client'

import { useChat } from 'ai/react'
import { InputPanelStream } from './components/InputPanelStream'
import { MessagePanel } from './components/MessagePanel'
import { HeaderBar } from './HeaderBar'

export type ChatMessageItem = {
  role: 'system' | 'user' | 'assistant' | 'function'
  name?: string
  content: string
}

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      // model: 'gpt-3.5-turbo',
      // provider: 'openai',
      model: 'nousresearch/nous-hermes-llama2-13b',
      provider: 'openrouter',
      stream: true,
    },
  })

  const addDebugMessages = () => {
    // const newMessages = [...messages, ..._sampleMessagesMany]
    // setMessages(newMessages)
  }

  const clearMessages = () => {
    // setMessages([initialMessage])
  }

  return (
    <>
      <div className="mx-auto flex h-full max-w-md flex-col justify-between bg-base-100 pt-3">
        <HeaderBar addMessages={addDebugMessages} clearMessages={clearMessages} />
        <MessagePanel messages={messages} />
        <InputPanelStream
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
        />
      </div>
    </>
  )
}

const ROLE = {
  system: 'system',
  user: 'user',
  assistant: 'assistant',
} as const

const initialMessage = {
  role: 'system',
  content: 'This is the start of the chat.',
} as const

const _sampleMessagesMany: ChatMessageItem[] = [
  {
    role: 'user',
    name: 'Katelynn',
    content: 'In elit laborum sunt sint consequat incididunt eiusmod occaecat.',
  },
  {
    role: 'assistant',
    content:
      'Et amet ullamco exercitation ad nulla esse adipisicing do cupidatat cillum non sit excepteur reprehenderit cillum. Commodo in laborum consequat quis deserunt esse. Eiusmod ex magna eu culpa id dolore culpa laboris tempor. Ea laboris excepteur sint dolor elit nisi anim exercitation ipsum sunt cupidatat consectetur labore aliqua nostrud. Ullamco dolore laboris id.',
  },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Ut pariatur fugiat irure anim mollit ad amet.',
  },
  {
    role: 'assistant',
    content:
      'Amet ad Lorem cillum. Minim aliqua culpa exercitation aute ipsum sunt incididunt culpa quis culpa duis eu consectetur duis esse. Laboris consequat occaecat deserunt consequat cupidatat nisi. Nostrud duis officia velit dolore reprehenderit eiusmod id non elit aliqua adipisicing elit. Ad duis mollit enim aliqua pariatur non magna ad amet id ad dolore nulla incididunt dolore. Sunt ex consectetur aliqua dolor aliquip. Elit et quis pariatur cillum dolore culpa consequat nisi duis ad amet sint duis commodo proident.',
  },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Eiusmod non sit cillum dolore nulla.',
  },
  {
    role: 'assistant',
    content:
      'Officia sint in adipisicing ex exercitation. Quis voluptate cupidatat consequat Lorem aute exercitation anim mollit amet labore cupidatat qui Lorem exercitation. Eu tempor non dolor nulla esse culpa. Aliqua in non mollit tempor ea. Dolore ex aliqua esse proident amet ullamco commodo proident amet esse non pariatur. Sunt incididunt non veniam ea enim veniam voluptate.',
  },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Minim ut incididunt eu proident.',
  },
  {
    role: 'assistant',
    content:
      'Elit dolore aliqua in voluptate anim quis pariatur amet elit laboris ut amet et nostrud. Amet laboris cillum esse sunt commodo irure. Dolore laborum ad velit cillum sunt. Do elit occaecat est dolore proident in qui minim exercitation excepteur et nisi proident pariatur cupidatat. Nulla consequat ex pariatur exercitation officia eu est. Aliquip cupidatat reprehenderit aliquip ad commodo voluptate id et cupidatat aliquip eu sint non. Qui excepteur proident voluptate id ut consequat fugiat.',
  },
]
