'use client'

import { useChatApi } from '@/components/chat/_unused/use-chat-api'
import { DebugMenu } from '@/components/chat/debug-menu'
import { MessageBubble } from '@/components/chat/message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import {
  FaceIcon,
  HeartIcon,
  MixerHorizontalIcon,
  PaperPlaneIcon,
  PinBottomIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useImmer } from 'use-immer'
import { TextareaAutosize } from '../../ui/textarea-autosize'
import { EngineTable } from '../engine-table'
import { EngineInputControls } from '../form/engine-input-controls'
import { ChatSession } from '../types'
import { EngineCombobox } from './engine-combobox'

export function Chat({
  sessionConfig,
  currentEngine,
  engineList,
}: {
  sessionConfig: ChatSession
  currentEngine: Engine
  engineList: Pick<Engine, 'id' | 'displayName'>[]
}) {
  const [session, setSession] = useImmer(sessionConfig)

  const engine = currentEngine

  const chatHelpers = useChatApi(session, engine)
  const { messages, setMessages, resetMessages, addMessage, requestStatus } = chatHelpers

  const [showChatForm, setShowChatForm] = useState(false)
  const [showEngineInfo, setShowEngineInfo] = useState(false)

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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [message, setMessage] = useState('')
  const isValidMessage = message !== ''

  const submitMessage = () => {
    if (isValidMessage) {
      chatHelpers.submitMessage('user', message)
      setMessage('')
    }
  }

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
                ['session', () => console.log(session)],
                ['engineInput', () => console.log(session.engineInput[engine.id])],
              ]}
            />
          </div>

          <div className="max-w-md" onClick={() => setShowEngineInfo(true)}>
            <EngineCombobox
              engineList={engineList}
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
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="justify-center font-normal">engine info</AccordionTrigger>
            <AccordionContent>
              <EngineTable engine={engine} className={''}></EngineTable>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Chat Content */}
      <div
        ref={contentAreaRef}
        className="chat-layout-content relative grid max-w-3xl grid-rows-[1fr,_auto] border-r shadow-inner"
      >
        {/* Message Feed */}
        <div className={cn('space-y-4 pb-14 pt-2.5', showChatForm && 'hidden')}>
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

        {/* Engine Input */}
        <EngineInputControls
          className={cn(
            'mx-auto w-full max-w-2xl space-y-8 px-4 py-4',
            showChatForm ? '' : 'hidden',
          )}
          immerSession={[session, setSession]}
          engine={engine}
        />
      </div>

      {/* Bottom Panel */}
      <div className="chat-layout-bottom-panel relative flex max-w-3xl items-center justify-center border-r border-t px-2">
        <span className="hidden text-muted-foreground sm:inline sm:text-sm">
          Press Enter ⏎ for a new line / Press ⌘ + Enter to send
        </span>

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

        {/* Message Input */}
        <div
          className={cn(
            'absolute -top-16 flex w-11/12 items-end rounded-3xl border bg-background px-2 py-2 focus-within:ring-1 focus-within:ring-ring',
            showChatForm && 'hidden',
          )}
        >
          <Button className="rounded-2xl" variant="outline" type="button">
            <HeartIcon />
          </Button>
          <TextareaAutosize
            ref={textareaRef}
            className="w-full resize-none bg-transparent px-2 py-1.5 placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Speak..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                submitMessage()
              }
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="rounded-2xl"
            variant={isValidMessage ? 'default' : 'outline'}
            onClick={submitMessage}
          >
            <PaperPlaneIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
