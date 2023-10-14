'use client'

import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { cn, raise } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, PinBottomIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { ChatInputPanel } from './input-panel'
import { ChatBarMenuItem } from './menu'
import { ChatMessageBubble } from './message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from './sample-data'
import type { ChatModelOption, ChatSession } from './types'
import { useChatApp } from './useChatApp'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

const defaultPrompt = 'You are a cheerful and helpful AI assistant named %%title%%.'

export function ChatPanel({ session, updateSession, modelsAvailable }: Props) {
  const { panel } = session

  //* model selection
  const modelsComboList = modelsAvailable.map((m) => ({
    value: `${m.provider}::${m.model}`,
    label: m.label,
  }))
  const handleModelSelect = (selected: string) => {
    updateSession((s) => {
      const [provider, model] = selected.split('::')
      s.parameters.provider = provider ?? raise('invalid provider')
      s.parameters.model = model ?? raise('invalid model')
    })
  }
  const selectedModel = `${session.parameters.provider}::${session.parameters.model}`

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
  useEffect(() => scrollToBottom(), [messages])
  const [bottomRef, bottomIsVisible] = useInView()

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
        <div className="flex w-[50%]">
          <Combobox
            items={modelsComboList}
            buttonProps={{ className: 'w-[140px] sm:w-[230px] px-1' }}
            popoverProps={{ className: 'w-[230px]' }}
            selectText="Select model..."
            searchText="Search model..."
            value={selectedModel}
            onSelect={handleModelSelect}
          />
        </div>

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
        <ChatMessageBubble
          message={{
            id: 'debug',
            role: 'system',
            content: `${selectedModel} stream: ${session.parameters.stream}`,
          }}
        />
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
