'use client'

import { Button } from '@/components/ui/button'
import { ChatModelOption } from '@/lib/api'
import { cn, raise } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, PinBottomIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import * as R from 'remeda'
import { InferenceParameterControls } from './inference-parameter-controls'
import { InferenceParameterForm } from './inference-parameter-form'
import { ChatInputPanel } from './input-panel'
import { ChatBarMenuItem } from './menu'
import { ChatMessageBubble } from './message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from './sample-data'
import type { ChatSession } from './types'
import { useChatApp } from './use-chat-app'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

const defaultPrompt = 'You are a cheerful and helpful AI assistant named %%title%%.'

export function ChatPanel({ session, updateSession, modelsAvailable }: Props) {
  const { panel, parameters } = session

  //* chat configuration
  const prompt = defaultPrompt.replace('%%title%%', session.panel.title)
  const chatHelpers = useChatApp(session, prompt)
  const { messages, setMessages, isLoading, resetChatMessages } = chatHelpers

  //* ID of streaming message if active
  const isLastMessageStreaming =
    isLoading && messages.at(-1)?.role === 'assistant' ? messages.at(-1)?.id : ''

  //* scroll to panel on mount
  const panelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  //* scroll panel to bottom
  const messageContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollToBottom = (behavior?: 'auto' | 'instant' | 'smooth') => {
    if (!messageContainerRef.current) return
    const height = messageContainerRef.current.scrollHeight
    messageContainerRef.current.scrollTo({ top: height, behavior })
  }

  //* auto scroll on message change
  useEffect(() => scrollToBottom(), [messages.length])
  const [bottomRef, bottomIsVisible] = useInView()

  const _params = Object.entries(parameters).map(([key, value]) => ` ${key}: ${value}`)
  return (
    <div
      id="e-chat-panel"
      className="flex h-full w-screen flex-col rounded-md border-2 bg-background sm:max-w-2xl"
      ref={panelRef}
    >
      {/* //* Control Bar */}
      <div
        id="e-chat-control-bar"
        className="flex items-center justify-between border-b bg-muted px-2 py-1 font-medium"
      >
        {/* //* Bar Left */}
        <div className="flex w-[50%]"></div>

        {/* //* Bar Middle */}
        <div className="">
          <h2>{panel.title}</h2>
        </div>

        {/* //* Bar Right */}
        <div className="flex w-[50%] justify-end">
          <Button variant="outline" size="icon">
            <MixerHorizontalIcon />
          </Button>
          <Button variant="outline" onClick={() => resetChatMessages()}>
            clear
          </Button>
        </div>
      </div>

      {/* //* Messages */}
      <div
        id="e-chat-messages-container"
        className="flex h-96 grow flex-col items-center space-y-4 overflow-y-auto px-2 pt-4"
        ref={messageContainerRef}
      >
        {/* Parameter Config Panel */}
        <div className="w-11/12 space-y-2 rounded-md border-2 px-4 py-2">
          <InferenceParameterForm className="space-y-2" modelsAvailable={modelsAvailable} />
        </div>

        {messages.map((m) => (
          <ChatMessageBubble message={m} showLoader={m.id === isLastMessageStreaming} key={m.id} />
        ))}

        {/* //* Awaiting Response Indicator */}
        {isLoading && !isLastMessageStreaming ? (
          <ChatMessageBubble message={null} showLoader={true} />
        ) : null}
        {/* //* Auto Scroll Target */}
        <div id="scroll-to-btm-observer" ref={bottomRef} className="w-full" />
      </div>

      {/* //* Scroll To Bottom Button */}
      <div className="relative w-12 self-end">
        <Button
          variant="outline"
          size="icon"
          name="scroll to bottom"
          className={cn('absolute bottom-12 opacity-80', bottomIsVisible && 'hidden')}
          onClick={() => scrollToBottom('smooth')}
        >
          <PinBottomIcon className="h-6 w-6 text-secondary-foreground" />
        </Button>
      </div>

      {/* //* Input Panel */}
      <ChatBarMenuItem
        label={<FaceIcon />}
        heading="Debug"
        items={[
          ['Add lorem', () => setMessages([...messages, ...sampleConvo])],
          ['Add code', () => setMessages([...messages, ...sampleCode])],
          ['Add markdown', () => setMessages([...messages, ...sampleMessages])],
        ]}
      />
      <ChatInputPanel chatHelpers={chatHelpers} />
    </div>
  )
}
