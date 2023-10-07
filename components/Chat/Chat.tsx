'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { useEffect, useMemo, useRef, useState } from 'react'
import { _sampleMessages } from './_sampleMessages'
import { MessageBubble } from './MessageBubble'

export type ChatMessage = Message

type Props = {
  model: string
  provider: string
  prompt: string
  title: string
}
export function Chat({ model, provider, prompt, title }: Props) {
  //* chat configuration
  const initialMessages = useMemo(
    () => [createChatMessage({ role: 'system', content: prompt })],
    [prompt],
  )

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat({
    id: title,
    api: '/api/chat',
    initialMessages,
    body: {
      model,
      provider,
      stream: true,
    },
    onResponse() {
      setIsAwaitingResponse(false)
    },
    onFinish(message) {
      console.log('[finish]', message)
    },
    onError(error) {
      console.error('[error]', error)
    },
  })

  //* useChat/API status
  const isInProgress = isLoading
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false)

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
    scrollRef.current?.scrollIntoView({ block: 'center' })
  }, [messages])

  const formRef = useRef<HTMLFormElement | null>(null)

  //* debug actions
  const handleDebugClick = () => {
    if (messages.length === 1) setMessages([...messages, ..._sampleMessages])
    console.log(messages)
  }

  return (
    <main className="mx-auto h-full max-w-5xl bg-base-200">
      {/* Controls */}
      <div className="navbar rounded-b-md bg-primary text-primary-content">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl normal-case">{title}</a>
        </div>

        <div className="navbar-center"></div>

        <div className="navbar-end">
          <button
            className="btn btn-ghost normal-case"
            onClick={() => setMessages(initialMessages)}
          >
            new chat
          </button>
          <button className="btn btn-circle btn-ghost" onClick={handleDebugClick}>
            π
          </button>
        </div>
      </div>

      {/* Message Display */}
      <div className="mx-auto max-w-5xl bg-base-200 px-3">
        {messages.map((msg, i) => (
          <MessageBubble message={msg} key={i} />
        ))}
        {isAwaitingResponse ? <MessageBubble message={{ role: 'assistant' }} /> : ''}
        <div id="auto-scroll-target" className="h-16" ref={scrollRef} />
      </div>

      {/*  Input Panel */}
      <div className="fixed bottom-0 mx-auto w-full max-w-5xl" id="input-panel">
        <form
          className="flex justify-center gap-4 rounded-t-md bg-base-200 px-4 py-2 align-middle"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            setIsAwaitingResponse(true)
            handleSubmit(e)
          }}
        >
          <textarea
            className="font textarea textarea-primary textarea-md flex-auto resize-none overflow-y-hidden text-base"
            rows={1}
            required={true}
            placeholder="Speak..."
            value={input}
            ref={textareaRef}
            disabled={isInProgress}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && formRef.current) {
                e.preventDefault()
                formRef.current.requestSubmit()
              }
            }}
          />
          <div className="flex flex-col justify-center">
            <button className="btn btn-circle btn-primary" disabled={isInProgress} type="submit">
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
