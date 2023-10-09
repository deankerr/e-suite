'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CodeSandboxLogoIcon,
  FaceIcon,
  MixerHorizontalIcon,
  SketchLogoIcon,
} from '@radix-ui/react-icons'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { ChatInputPanel } from './input-panel'

type Props = {}

export function ChatApp(props: Props) {
  //* temp config
  const model = 'gpt-3.5-turbo'
  const provider = 'openai'
  const title = 'Pinata'
  const prompt = 'You are a cheerful and helpful AI assistant named Piñata. Use Markdown.'

  //* chat configuration
  const { messages, isLoading, setMessages, setInput, input, handleInputChange, handleSubmit } =
    useChat({
      id: title,
      api: '/api/chat',
      initialMessages: [{ id: nanoid(), role: 'system', content: prompt }],
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
    <div id="e-chat-component" className="flex grow flex-col rounded-md border-2 bg-background">
      {/* Title/Controls */}
      <div className="flex items-center border-b bg-muted px-2 py-1 font-medium">
        <Button variant="ghost" size="icon" className="">
          <FaceIcon />
        </Button>
        <div className="h-full grow text-center">{title}</div>
        <div>
          <Button variant="outline" size="icon" className="">
            <MixerHorizontalIcon />
          </Button>
          <Button variant="outline" size="icon" className="">
            <SketchLogoIcon />
          </Button>
          <Button variant="outline" size="icon" className="">
            <CodeSandboxLogoIcon />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        id="e-messages-container"
        className="flex grow flex-col items-center justify-end space-y-4 px-4 py-4"
      >
        {messages.map((m) => {
          const style =
            m.role === 'user'
              ? 'ml-auto bg-primary text-primary-foreground'
              : m.role === 'assistant'
              ? 'mr-auto bg-muted'
              : 'bg-secondary text-secondary-foreground text-center'
          return (
            <div className={cn('max-w-[75%] rounded-lg px-3 py-2', style)} key={m.id}>
              {m.content}
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
