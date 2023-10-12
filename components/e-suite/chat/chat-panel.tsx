'use client'

import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useEffect, useRef } from 'react'
import { ChatInputPanel } from './input-panel'
import { ChatBarMenuItem } from './menu'
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

  const showLoaderId = isLoading && messages.at(-1)?.role === 'assistant' ? messages.at(-1)?.id : ''
  const showLoaderAfter = isLoading && !showLoaderId

  //* auto scroll on message change
  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: 'center' })
  }, [messages])

  return (
    <div id="e-chat-panel" className="flex grow flex-col rounded-md border-2 bg-background">
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
              ['Add convo', () => setMessages([...messages, ...sampleConvo])],
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
        className="flex grow flex-col space-y-4 overflow-y-auto px-3 py-4 sm:px-4"
      >
        {messages.map((m) => {
          const isUser = m.role === 'user'
          const isAi = m.role === 'assistant'
          const content = showLoaderId === m.id ? m.content + '[icon](loadingball)' : m.content
          return (
            <div
              className={cn('prose prose-stone w-fit rounded-lg px-3 py-2 dark:prose-invert', {
                'ml-[10%] self-end bg-primary text-primary-foreground sm:ml-[20%]': isUser,
                'mr-[10%] bg-muted text-secondary-foreground sm:mr-[20%]': isAi,
                'mx-[5%] self-center bg-secondary text-center text-secondary-foreground sm:mx-[10%]':
                  !(isUser || isAi),
              })}
              key={m.id}
            >
              <Markdown>{content}</Markdown>
            </div>
          )
        })}

        {/* Loading Indicator */}
        {showLoaderAfter ? (
          <div
            className={cn(
              'prose prose-stone mr-[10%] w-fit rounded-lg bg-muted px-3 py-2 text-secondary-foreground dark:prose-invert sm:mr-[20%] ',
            )}
          >
            <Loading icon="ball" size="md" />
          </div>
        ) : null}

        {/* Auto Scroll Target */}
        <div id="auto-scroll-target" className="" ref={scrollRef} />
      </div>

      {/* Input */}
      <ChatInputPanel chatHelpers={chatHelpers} />
    </div>
  )
}
