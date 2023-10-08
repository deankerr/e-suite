'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { useEffect, useRef, useState } from 'react'
import { shuffle } from 'remeda'
import { _sampleInput, _sampleMessages } from './_sampleData'
import { MessageBubble } from './MessageBubble'

export type ChatMessage = Message

type Props = {
  model: string
  provider: string
  prompt: string
  title: string
  names: {
    user: string
    assistant: string
  }
}
export function Chat({ model, provider, prompt, title, names }: Props) {
  //* chat configuration
  const initialMessages = [createMessage({ role: 'system', content: prompt })]

  const chatHelpers = useChat({
    id: title,
    api: '/api/chat',
    initialMessages,
    body: {
      model,
      provider,
      stream: true,
    },
    headers: {
      pirce: 'yes sir',
    },
    onResponse: (response) => {
      console.log('[response]', response)
      setIsAwaitingResponse(false)
    },
    onFinish: (message) => console.log('[finish]', message),
    onError: (error) => console.error('[error]', error),
  })

  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
  } = chatHelpers

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

  //* debug
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  return (
    <main className="mx-auto min-h-full max-w-4xl bg-base-200">
      {/* Controls */}
      <div className="navbar sticky top-0 rounded-b-md bg-primary font-mono text-primary-content shadow-lg">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl normal-case">{title}</a>
        </div>
        <div className="navbar-center"></div>
        {/* Debug Menu */}
        <div className="navbar-end">
          <ul className="menu menu-horizontal px-1">
            <li tabIndex={0}>
              <details>
                <summary>π</summary>
                <ul className="p-2 text-base-content">
                  <li>
                    <a onClick={() => setInput(shuffle(_sampleInput)[0] ?? '')}>test input</a>
                  </li>
                  <li>
                    <a onClick={() => console.log(messages)}>log</a>
                  </li>
                  <li>
                    <a onClick={() => setMessages([...messages, ..._sampleMessages])}>lorem</a>
                  </li>
                  <li>
                    <a onClick={() => setShowDebugInfo(!showDebugInfo)}>debug</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
          <button
            className="btn btn-ghost font-normal normal-case"
            onClick={() => setMessages(initialMessages)}
          >
            new chat
          </button>
        </div>
      </div>

      {/* Message Display */}
      <div className="mx-auto px-3">
        {messages.map((msg, i) => (
          <MessageBubble message={msg} names={names} key={i} debug={showDebugInfo} />
        ))}
        {isAwaitingResponse ? <MessageBubble message={{ role: 'assistant' }} names={names} /> : ''}
        {error ? <ErrorToast message={error.message} /> : ''}
        <div id="auto-scroll-target" className="h-16" ref={scrollRef} />
      </div>

      {/*  Input Panel */}
      <div className="fixed bottom-0 mx-auto w-full max-w-4xl" id="input-panel">
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

function createMessage(
  messageProps: Partial<ChatMessage> & Pick<ChatMessage, 'role' | 'content'>,
): ChatMessage {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)
  const message = { id: nanoid(), ...messageProps }
  return message
}

function ErrorToast({ message }: { message: string }) {
  return (
    <div className="toast toast-center mb-16">
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  )
}
