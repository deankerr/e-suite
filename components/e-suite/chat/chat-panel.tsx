'use client'

import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useEffect, useRef } from 'react'
import { ChatInputPanel } from './input-panel'
import { ChatBarMenuItem } from './menu'
import { ChatMessageBubble } from './message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from './sample-data'
import { useChatApp } from './useChatApp'

type Props = {
  chatSessionId: string
  api?: string
  model?: string
  provider?: string
  title: string
  prompt?: string
  stream?: boolean
}

const defaultConfig = {
  api: '/api/chat',
  model: 'gpt-3.5-turbo',
  provider: 'openai',
  prompt: 'You are a cheerful and helpful AI assistant named %%title%%. Use Markdown.',
  stream: true,
}

export function ChatPanel(props: Props) {
  const config = {
    ...defaultConfig,
    ...props,
  }
  config.prompt = config.prompt.replace('%%title%%', config.title)
  const panelTitle = config.title

  //* chat configuration
  const chatHelpers = useChatApp(config)
  const { messages, setMessages, isLoading, resetChatMessages } = chatHelpers

  // ID of streaming message if active
  const isLastMessageStreaming =
    isLoading && messages.at(-1)?.role === 'assistant' ? messages.at(-1)?.id : ''

  //* auto scroll on message change
  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: 'center' })
  }, [messages])

  return (
    <div
      id="e-chat-panel"
      className="flex h-full w-screen flex-col rounded-md border-2 bg-background sm:max-w-2xl"
    >
      {/* Control Bar */}
      <div
        id="e-chat-control-bar"
        className="flex items-center justify-between border-b bg-muted px-2 py-1 font-medium"
      >
        {/* Bar Left */}
        <div className="w-[50%]">
          <ChatBarMenuItem
            label={<FaceIcon />}
            heading="Debug"
            items={[
              ['Add lorem', () => setMessages([...messages, ...sampleConvo])],
              ['Add code', () => setMessages([...messages, ...sampleCode])],
              ['Add markdown', () => setMessages([...messages, ...sampleMessages])],
            ]}
          />
        </div>
        {/* Bar Middle */}
        <div className="">
          <h2>{panelTitle}</h2>
        </div>
        {/* Bar Right */}
        <div className="flex w-[50%] justify-end">
          <Button variant="outline" size="icon">
            <MixerHorizontalIcon />
          </Button>
          <Button variant="outline" onClick={() => resetChatMessages()}>
            clear
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        id="e-chat-messages-container"
        className="flex h-96 grow flex-col items-center space-y-4 overflow-y-auto px-2 py-4"
      >
        {messages.map((m) => (
          <ChatMessageBubble message={m} showLoader={m.id === isLastMessageStreaming} key={m.id} />
        ))}

        {/* Awaiting Response Indicator */}
        {isLoading && !isLastMessageStreaming ? (
          <ChatMessageBubble message={null} showLoader={true} />
        ) : null}

        {/* Auto Scroll Target */}
        <div id="auto-scroll-target" className="" ref={scrollRef} />
      </div>

      {/* Input Panel */}
      <ChatInputPanel chatHelpers={chatHelpers} />
    </div>
  )
}
