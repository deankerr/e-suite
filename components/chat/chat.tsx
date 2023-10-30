'use client'

import { DebugMenu } from '@/components/chat/debug-menu'
import { ChatForm } from '@/components/chat/form/chatForm'
import { MessageBubble } from '@/components/chat/message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { useChatApi } from '@/components/chat/use-chat-api'
import { Button } from '@/components/ui/button'
import { chatsConfig } from '@/config/chats'
import { getEngineById, getEngines } from '@/lib/api/engines'
import { cn } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, PinBottomIcon, TrashIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useImmer } from 'use-immer'
import { EngineCombobox } from './engine-combobox'
import { EngineInfo } from './engine-info'

function getChatConfig(name: string) {
  const chatConfig = chatsConfig.find((c) => c.name === decodeURI(name))
  if (!chatConfig) throw new Error(`Unable to find chat config for ${name}`)
  return chatConfig
}

export function Chat(props: { name: string }) {
  const chatConfig = getChatConfig(props.name)
  const [session, setSession] = useImmer(chatConfig)
  const engine = getEngineById(session.engineId)
  const engines = getEngines()

  // TODO
  if (!engine) throw new Error('invalid engine')

  const chatHelpers = useChatApi(session)
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
      <div className="chat-layout-top-panel max-w-3xl border-b border-r p-2">
        <div className="grid grid-cols-[1fr_2fr_1fr]">
          <div className="font-mono text-sm text-muted-foreground">
            <DebugMenu
              className="rounded-none border-none"
              label={<FaceIcon />}
              heading={`${session.id}/${session.name}`}
              items={[
                ['Add lorem', () => setMessages([...messages, ...sampleConvo])],
                ['Add code', () => setMessages([...messages, ...sampleCode])],
                ['Add markdown', () => setMessages([...messages, ...sampleMessages])],
                ['Add user message', () => addMessage('user', 'Hello friend.')],
                ['Add ai message', () => addMessage('assistant', 'Greetings, I am a prototype.')],
                ['log chat', () => console.log(session)],
              ]}
            />
          </div>
          <div className="max-w-md">
            <EngineCombobox
              engines={engines}
              current={engine.id}
              setCurrent={(id) =>
                setSession((s) => {
                  s.engineId = id
                })
              }
            />
          </div>
          <div className="text-right">
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

        <EngineInfo engine={engine} />
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
          engine={engine}
          currentInput={session.engineInput}
          handleSubmit={(values) => {
            const { engineId, message, ...input } = values
            setSession((c) => {
              c.engineId = engineId
              c.engineInput = { [engineId]: input }
            })

            chatHelpers.submitMessage('user', message, {
              engineId: engineId,
              input: input,
            })
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
