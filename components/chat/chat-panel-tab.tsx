'use client'

import { Button } from '@/components/ui/button'
import { ChatModelOption } from '@/lib/api'
import { cn, raise } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, PinBottomIcon, TrashIcon } from '@radix-ui/react-icons'
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

  //! temp dummy update function
  const updateSession = (temp: (temp2: Record<string, object>) => void) => {}

  //* chat configuration
  const prompt = defaultPrompt.replace('%%title%%', session.panel.title)
  const chatHelpers = useChatApp(session, prompt)
  const { messages, setMessages, isLoading, resetChatMessages } = chatHelpers

  //* ID of streaming message if active
  const isLastMessageStreaming =
    isLoading && messages.at(-1)?.role === 'assistant' ? messages.at(-1)?.id : ''

  //* scroll to panel on mount
  // const panelRef = useRef<HTMLDivElement | null>(null)
  // useEffect(() => {
  //   panelRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [])

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

  const messageContent = (
    <>
      <div
        id="e-chat-content-messages"
        className="flex grow flex-col items-center space-y-4 overflow-y-auto px-3 pt-4"
        ref={messageContainerRef}
      >
        {messages.map((m) => (
          <ChatMessageBubble message={m} showLoader={m.id === isLastMessageStreaming} key={m.id} />
        ))}

        {isLoading && !isLastMessageStreaming ? (
          <ChatMessageBubble message={null} showLoader={true} />
        ) : null}
        <div id="scroll-to-btm-observer" ref={bottomRef} className="w-full" />
      </div>

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
    </>
  )

  return (
    <>
      {/* top panel */}
      <div className="flex h-10 flex-none items-center justify-between px-1 text-sm text-muted-foreground shadow-md">
        <div></div>
        {modelsAvailable.find((m) => m.id === parameters.modelId)?.label ?? 'huh?'}
        <div className="space-x-1">
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
            <MixerHorizontalIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => resetChatMessages()}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {content === 'form' ? formContent : messageContent}
    </>
  )
}
