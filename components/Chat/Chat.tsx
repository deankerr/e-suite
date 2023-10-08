'use client'

import { ExclamationCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { useSearchParams } from 'next/navigation'
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
    onError: (error) => {
      console.error('[error]', error)
      setErrorMessage(error.message)
    },
  })

  const { messages, input, isLoading, handleInputChange, handleSubmit, setMessages, setInput } =
    chatHelpers

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

  //* error display
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const errorToast = errorMessage ? (
    <div className="fixed top-24 w-full max-w-4xl">
      <div
        className="alert alert-error mx-auto w-fit max-w-screen-sm shadow-md"
        onClick={() => setErrorMessage(null)}
      >
        <ExclamationCircleIcon className="w-8" />
        <span>{errorMessage}</span>
      </div>
    </div>
  ) : null

  //* debug menu
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const debugMenu = useSearchParams().get('debug') ? (
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
            <li>
              <a onClick={() => setErrorMessage('An error is in progress.')}>error</a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  ) : null

  return (
    <main className="bg-grid-teal mx-auto flex min-h-full max-w-4xl flex-col bg-base-200">
      {/* Controls */}
      <div className="navbar sticky top-0 rounded-b-md bg-primary font-mono text-primary-content shadow-lg">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl normal-case">{title}</a>
        </div>
        <div className="navbar-center"></div>
        <div className="navbar-end">
          {/* Debug Menu */}
          {debugMenu}
          <button
            className="btn btn-ghost font-normal normal-case"
            onClick={() => setMessages(initialMessages)}
          >
            clear
          </button>
        </div>
      </div>

      {/* Message Display */}
      <div className="flex min-h-full grow flex-col justify-end px-3 pt-1">
        {messages.map((msg, i) => (
          <MessageBubble message={msg} names={names} key={i} debug={showDebugInfo} />
        ))}

        {/* Loading Icon Message Bubble */}
        {isAwaitingResponse ? <MessageBubble message={{ role: 'assistant' }} names={names} /> : ''}

        <div id="auto-scroll-target" className="h-20" ref={scrollRef} />
      </div>

      {/* Error Message */}
      {errorToast}

      {/*  Input Panel */}
      <div className="fixed bottom-0 mx-auto w-full max-w-4xl" id="input-panel">
        <form
          className="flex justify-center gap-4 rounded-t-md bg-base-200 px-4 py-2 align-middle"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            setIsAwaitingResponse(true)
            setErrorMessage(null)
            handleSubmit(e)
          }}
        >
          <textarea
            className="font textarea textarea-primary textarea-md flex-auto resize-none overflow-y-hidden text-base"
            name="message input"
            rows={1}
            required={true}
            placeholder="Speak..."
            value={input}
            ref={textareaRef}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey && formRef.current) {
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
