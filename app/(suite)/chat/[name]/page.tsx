'use client'

import { ChatBarMenuItem } from '@/components/chat/menu'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { Button } from '@/components/ui/button'
import { chatsConfig } from '@/config/chats'
import { getModelById } from '@/lib/api'
import { cn } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, PinBottomIcon, TrashIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useImmer } from 'use-immer'
import { ChatForm } from './form/chatForm'
import { MessageBubble } from './message-bubble'
import { useChatApi } from './use-chat-api'

function getChatConfig(name: string) {
  const chatConfig = chatsConfig.find((c) => c.name === decodeURI(name))
  if (!chatConfig) throw new Error(`Unable to find chat config for ${name}`)
  return chatConfig
}

export default function ChatPage({ params }: { params: { name: string } }) {
  const chatConfig = getChatConfig(params.name)
  const [chat, setChat] = useImmer(chatConfig)
  const model = getModelById(chat.modelId)

  const chatHelpers = useChatApi(chat)
  const { messages, setMessages, resetMessages, addMessage, requestStatus } = chatHelpers

  const [showChatForm, setShowChatForm] = useState(false)

  const contentAreaRef = useRef<HTMLDivElement | null>(null)
  const [contentScrolledRef, isScrolledToEnd] = useInView({
    initialInView: true,
    fallbackInView: true,
  })

  const scrollFeedToEnd = () => {
    if (!contentAreaRef.current) return
    const { scrollHeight } = contentAreaRef.current
    contentAreaRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    scrollFeedToEnd()
  }, [messages.length])

  return (
    <>
      {/* Top Panel */}
      <div className="chat-layout-top-panel flex max-w-3xl items-center justify-between border-b border-r text-sm text-muted-foreground">
        <div className="font-mono text-xs">
          <ChatBarMenuItem
            className="rounded-none border-none"
            label={<FaceIcon />}
            heading={`${chat.id}/${chat.name}`}
            items={[
              ['Add lorem', () => setMessages([...messages, ...sampleConvo])],
              ['Add code', () => setMessages([...messages, ...sampleCode])],
              ['Add markdown', () => setMessages([...messages, ...sampleMessages])],
              ['Add user message', () => addMessage('user', 'Hello friend.')],
              ['Add ai message', () => addMessage('assistant', 'Greetings, I am a prototype.')],
              ['log chat', () => console.log(chat)],
            ]}
          />
        </div>
        <div>{model.label}</div>
        <div>
          <Button
            className={cn('rounded-none border-transparent shadow-none', 'border-l-input')}
            variant="outline"
            onClick={() => setShowChatForm(!showChatForm)}
          >
            <MixerHorizontalIcon />
          </Button>
          <Button
            className={cn('rounded-none border-transparent shadow-none', 'border-l-input')}
            variant="outline"
            onClick={() => resetMessages()}
          >
            <TrashIcon />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      <div
        ref={contentAreaRef}
        className="chat-layout-content relative grid max-w-3xl grid-rows-[1fr,_auto] border-r shadow-inner"
      >
        {/* Message Feed */}
        <div className={cn('space-y-4 py-2.5', showChatForm && 'hidden')}>
          {messages.map((m) => (
            <MessageBubble
              variant={m.role}
              content={m.content}
              loading={messages.at(-1)?.id === m.id && requestStatus === 'streaming'}
              key={m.id}
            />
          ))}
          {requestStatus === 'waiting' && (
            <MessageBubble variant="assistant" content="" loading={true} />
          )}
          <div ref={contentScrolledRef}></div>
        </div>

        {/* Chat Form */}
        <ChatForm
          className={cn(
            'w-full px-4 py-2',
            showChatForm
              ? 'space-y-8 [&>_:last-child]:hidden'
              : 'sticky bottom-0 [&>*:not(:last-child)]:hidden',
          )}
          session={chat}
          handleSubmit={(values) => {
            const { modelId, message, ...params } = values
            setChat((c) => {
              c.modelId = modelId
              c.parameters = params
            })
            chatHelpers.append({ role: 'user', content: message })
          }}
        />
      </div>

      {/* Bottom Panel */}
      <div className="chat-layout-bottom-panel relative flex max-w-3xl items-center justify-center border-r border-t px-2 text-xs text-muted-foreground sm:text-sm">
        Press Enter ⏎ for a new line / Press ⌘ + Enter to send
        {/* Scroll to end button */}
        <Button
          variant="outline"
          size="icon"
          name="scroll to bottom"
          className={cn(
            'absolute inset-x-[89%] -top-32 hidden',
            !isScrolledToEnd && !showChatForm && 'flex',
          )}
          onClick={() => scrollFeedToEnd()}
        >
          <PinBottomIcon className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}
