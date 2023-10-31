'use client'

import { DebugMenu } from '@/components/chat/debug-menu'
import { MessageBubble } from '@/components/chat/message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { useChatApi } from '@/components/chat/use-chat-api'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { chatsConfig } from '@/config/chats'
import { getEngineById, getEngines } from '@/lib/api/engines'
import { cn } from '@/lib/utils'
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
import { TextareaAutosize } from '../ui/textarea-autosize'
import { EngineCombobox } from './engine-combobox'
import { EngineInfo } from './engine-info'
import { EngineInputControls } from './form/engine-input-controls'

function getChatConfig(name: string) {
  const chatConfig = chatsConfig.find((c) => c.name === decodeURI(name))
  if (!chatConfig) throw new Error(`Unable to find chat config for ${name}`)
  return chatConfig
}

export function Chat(props: { name: string }) {
  const chatConfig = getChatConfig(props.name)
  const [session, setSession] = useImmer(chatConfig)

  const engine = getEngineById(session.engineId)
  const engineInput = session.engineInput[engine.id]

  const engines = getEngines()

  // TODO
  if (!engine) throw new Error('invalid engine')

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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null) // ?

  const [message, setMessage] = useState('')
  const isValidMessage = message !== ''

  const submitMessage = () => {
    if (isValidMessage) chatHelpers.submitMessage('user', message)
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
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="justify-center font-normal">engine info</AccordionTrigger>
            <AccordionContent>
              <EngineInfo engine={engine} className={''}></EngineInfo>
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
