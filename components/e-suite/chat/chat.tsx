'use client'

import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CodeIcon,
  FaceIcon,
  MixerHorizontalIcon,
  ResetIcon,
  SketchLogoIcon,
} from '@radix-ui/react-icons'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { ChatInputPanel } from './input-panel'
import { sampleCode, sampleMessages } from './sample-data'

type Props = {}

export function ChatApp(props: Props) {
  //* temp config
  const model = 'gpt-3.5-turbo'
  const provider = 'openai'
  const title = 'Piñata'
  const prompt = 'You are a cheerful and helpful AI assistant named Piñata. Use Markdown.'

  //* chat configuration
  const initialMessages = [{ id: nanoid(), role: 'system', content: prompt } as const]
  const { messages, isLoading, setMessages, setInput, input, handleInputChange, handleSubmit } =
    useChat({
      id: title,
      api: '/api/chat',
      initialMessages,
      body: {
        model,
        provider,
        stream: true,
      },
      headers: {
        pirce: 'yes sir',
      },
      onResponse: (response) => {
        console.log('[response]', response)
        // setIsAwaitingResponse(false)
      },
      onFinish: (message) => console.log('[finish]', message),
      onError: (error) => {
        console.error('[error]', error)
        // setErrorMessage(error.message)
      },
    })

  return (
    <div
      id="e-chat-component"
      className="flex max-w-xl grow flex-col rounded-md border-2 bg-background"
    >
      {/* Title/Controls */}
      <div className="flex items-center justify-between border-b bg-muted px-2 py-1 font-medium">
        <div className="w-[50%]">
          <Button variant="ghost" size="icon">
            <FaceIcon />
          </Button>
        </div>
        <div className="h-full">{title}</div>
        <div className="w-[50%] text-right">
          <Button variant="outline" size="icon">
            <MixerHorizontalIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMessages([...messages, ...sampleCode])}
          >
            <CodeIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMessages([...messages, ...sampleMessages])}
          >
            <SketchLogoIcon />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setMessages(initialMessages)}>
            <ResetIcon />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        id="e-messages-container"
        className="flex h-96 grow flex-col space-y-4 overflow-y-auto px-3 py-4 sm:px-4"
      >
        {messages.map((m) => {
          const isUser = m.role === 'user'
          const isAi = m.role === 'assistant'
          return (
            <div
              className={cn('prose prose-stone dark:prose-invert', 'rounded-lg px-3 py-2', {
                'ml-[10%] self-end bg-primary text-primary-foreground sm:ml-[20%]': isUser,
                'mr-[10%] bg-muted text-secondary-foreground sm:mr-[20%]': isAi,
                'mx-[5%] self-center bg-secondary text-center text-secondary-foreground sm:mx-[10%]':
                  !(isUser || isAi),
              })}
              key={m.id}
            >
              <Markdown>{m.content}</Markdown>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <ChatInputPanel
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)
