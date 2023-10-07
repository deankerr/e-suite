'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { useEffect, useRef } from 'react'
import { _sampleMessages } from './_sampleMessages'
import { MessageBubble } from './components/MessageBubble'

export type ChatMessage = Message

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    initialMessages,
    body: {
      model: 'gpt-4',
      provider: 'openai',
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

  const debugButtons = (
    <div className="fixed right-2 top-2 flex gap-1">
      <button className="btn w-fit" onClick={addDebugMessages}>
        add
      </button>
      <button className="btn inline w-fit" onClick={clearMessages}>
        clear
      </button>
    </div>
  )

  //* auto-resize textarea on change
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + 'px'
    }
  }, [input])

  //* auto scroll on message change
  // TODO support scrolling away during message change
  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    scrollRef.current?.scrollIntoView()
  }, [messages])

  return (
    <main className="min-h-screen bg-base-200" id="chat-messages">
      {debugButtons}

      {/* Message Display */}
      <div className="mx-auto max-w-5xl px-3 pb-20">
        {messages.map((msg, i) => (
          <MessageBubble message={msg} key={i} />
        ))}
        <div id="auto-scroll-target" ref={scrollRef} />
      </div>

      {/*  Input Panel */}
      <div className="fixed bottom-0 mx-auto w-full max-w-5xl" id="input-panel">
        <form
          className="flex justify-center gap-4 rounded-t-md bg-base-200 px-4 py-2 align-middle"
          onSubmit={handleSubmit}
        >
          <textarea
            className="font textarea textarea-primary textarea-md flex-auto overflow-y-hidden text-base"
            style={{ resize: 'none' }}
            placeholder="Enter your message..."
            value={input}
            onChange={handleInputChange}
            rows={1}
            ref={textareaRef}
          />
          <div className="flex flex-col justify-center">
            <button className="btn btn-circle btn-primary" type="submit">
              <PaperAirplaneIcon className="ml-1 w-8" />
            </button>
          </div>
        </form>
      </div>
    </main>
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

// const _chatbuttons = (
//   <>
//     <div className="btn btn-ghost">
//       <ChatBubbleLeftRightIcon className="w-8" />
//     </div>
//     <div className="btn btn-ghost">
//       <XCircleIcon className="w-8" />
//     </div>
//   </>
// )
