'use client'

import { ChatBarMenuItem } from '@/components/chat/menu'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { Button } from '@/components/ui/button'
import { chatsConfig } from '@/config/chats'
import { getAvailableChatModels } from '@/lib/api'
import { cn } from '@/lib/utils'
import { FaceIcon, MixerHorizontalIcon, TrashIcon } from '@radix-ui/react-icons'
import { ChatForm } from './form/chatForm'
import { MessageBubble } from './message-bubble'
import { useChatApi } from './use-chat-api'

function getChatConfig(name: string) {
  const chat = chatsConfig.find((c) => c.name === decodeURI(name))
  if (!chat) throw new Error(`Unable to find chat config for ${name}`)
  const model = getAvailableChatModels().find((m) => m.id === chat.modelId)
  if (!model) throw new Error(`Unable to find model id ${chat.modelId} for ${name}`)
  return { chat, model }
}

export default function ChatPage({ params }: { params: { name: string } }) {
  const { chat, model } = getChatConfig(params.name)
  const chatHelpers = useChatApi(chat)
  const { messages, setMessages, resetMessages } = chatHelpers
  const hideForm = true
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
            ]}
          />
        </div>
        <div>{model.label}</div>
        <div>
          <Button
            className={cn('rounded-none border-transparent shadow-none', 'border-l-input')}
            variant="outline"
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
      <div className="chat-layout-content grid max-w-3xl grid-flow-row grid-cols-[minmax(0,_0.75rem)_repeat(10,_minmax(0,_1fr))_minmax(0,_0.75rem)] gap-y-4 border-r py-4 shadow-inner">
        {/* Messages Feed */}
        {messages.map((m) => (
          <MessageBubble
            variant={m.role === 'user' ? 'local' : m.role === 'assistant' ? 'remote' : 'default'}
            content={m.content}
            key={m.id}
          />
        ))}

        {/* Chat Form */}
        <ChatForm
          className={cn(
            'sticky bottom-0 col-span-full w-full space-y-4',
            hideForm && '[&>*:not(:last-child)]:hidden',
          )}
          handleSubmit={(values) => {
            console.log('submit', values)
            chatHelpers.append({ role: 'user', content: values.message })
          }}
        />
      </div>

      {/* Bottom Panel */}
      <div className=" chat-layout-bottom-panel flex max-w-3xl items-center justify-center border-r border-t px-2 py-1 text-sm text-muted-foreground">
        Press Enter ⏎ for a new line / Press ⌘ + Enter to send
      </div>
    </>
  )
}
