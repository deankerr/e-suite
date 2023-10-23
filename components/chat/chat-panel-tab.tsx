'use client'

import { Button } from '@/components/ui/button'
import { ChatModelOption } from '@/lib/api'
import { cn, raise } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, PinBottomIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import * as R from 'remeda'
import { InferenceParameterForm } from '../inference-parameter-form/inference-parameter-form'
import { ChatBarMenuItem } from './menu'
import { ChatMessageBubble } from './message-bubble'
import { MessageTextInput } from './message-text-input'
import { sampleCode, sampleConvo, sampleMessages } from './sample-data'
import type { ChatSession } from './types'
import { useChatApp } from './use-chat-app'

type Props = {
  session: ChatSession
  modelsAvailable: ChatModelOption[]
}

const defaultPrompt = 'You are a cheerful and helpful AI assistant named %%title%%.'

export function ChatPanelTab({ session, modelsAvailable }: Props) {
  const { panel, parameters } = session
  const updateSession = (temp: (temp2: Record<string, object>) => void) => {}

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

  const [content, setContent] = useState<'messages' | 'form'>('messages')

  //* <Form>
  const formRef = useRef<HTMLFormElement | null>(null)
  const formContent = (
    <InferenceParameterForm
      ref={formRef}
      className="h-96 grow space-y-6 overflow-y-auto px-2 py-2"
      currentValues={session.parameters}
      modelsAvailable={modelsAvailable}
      onSubmit={(values) => {
        console.log('submit', values)
        updateSession((s) => (s.parameters = { ...s.parameters, ...values }))
      }}
    />
  )

  //* <Messages>
  const messagesContent = (
    <>
      <div
        id="e-chat-content-messages"
        className="flex grow flex-col items-center space-y-4 overflow-y-auto px-2 pt-4"
        ref={messageContainerRef}
      >
        <p className="text-sm text-muted-foreground">
          {modelsAvailable.find((m) => m.id === parameters.modelId)?.label ?? 'huh?'}
        </p>

        {messages.map((m) => (
          <ChatMessageBubble message={m} showLoader={m.id === isLastMessageStreaming} key={m.id} />
        ))}

        {/* Awaiting Response Indicator */}
        {isLoading && !isLastMessageStreaming ? (
          <ChatMessageBubble message={null} showLoader={true} />
        ) : null}
        {/* Auto Scroll Target */}
        <div id="scroll-to-btm-observer" ref={bottomRef} className="w-full" />
      </div>

      {/* Scroll To Bottom Button */}
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

      {/* Input Panel */}
      <MessageTextInput chatHelpers={chatHelpers} />
      <ChatBarMenuItem
        className="rounded-none bg-muted"
        label={<FaceIcon />}
        heading="Debug"
        items={[
          ['Add lorem', () => setMessages([...messages, ...sampleConvo])],
          ['Add code', () => setMessages([...messages, ...sampleCode])],
          ['Add markdown', () => setMessages([...messages, ...sampleMessages])],
        ]}
      />
      {/* <ChatInputPanel chatHelpers={chatHelpers} /> */}
    </>
  )

  return (
    <div
      id="e-chat-panel"
      className="flex h-full max-h-fit w-screen flex-col bg-background sm:w-full"
      ref={panelRef}
    >
      {/* Control Bar */}
      {/* <div
        id="e-chat-control-bar"
        className="flex items-center justify-between border-b px-2 py-1 font-medium shadow-md"
      >
        <div id="e-bar-left" className="flex w-[50%]"></div>
        <div id="e-bar-middle">
          <h2 onClick={() => console.log(session.panel.title, session)}>{panel.title}</h2>
        </div>
        <div id="e-bar-right" className="flex w-[50%] justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (content === 'messages') {
                setContent('form')
              } else {
                if (formRef.current) formRef.current.requestSubmit()
                setContent('messages')
              }
            }}
          >
            <MixerHorizontalIcon />
          </Button>
          <Button variant="outline" onClick={() => resetChatMessages()}>
            clear
          </Button>
        </div>
      </div> */}

      {/* Main Content */}
      {content === 'messages' ? messagesContent : formContent}
    </div>
  )
}
