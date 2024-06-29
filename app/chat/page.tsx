'use client'

import { useState } from 'react'
import { Chat, PaperPlaneRight } from '@phosphor-icons/react/dist/ssr'
import { Button, Card } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'

import { ChatModelCard, ChatModelCardSkeleton } from '@/components/cards/ChatModelCard'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { api } from '@/convex/_generated/api'
import { useChatModels } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const prioritizedModelKeys = [
  'openrouter::anthropic/claude-3.5-sonnet',
  'openai::openai/gpt-4o',
  'together::meta-llama/llama-3-70b-chat-hf',
  'openrouter::perplexity/llama-3-sonar-large-32k-online',
]

export default function Page() {
  const router = useRouter()
  const chatModels = useChatModels()

  const prioritizedModels = chatModels?.filter((model) =>
    prioritizedModelKeys.includes(model.resourceKey),
  )
  const otherModels = chatModels?.filter(
    (model) => !prioritizedModelKeys.includes(model.resourceKey),
  )
  const displayModels = prioritizedModels?.concat(otherModels ?? []).slice(0, 4)

  const [selectedModelKey, setSelectedModelKey] = useState('openai::openai/gpt-4o')
  const selectedModel = chatModels?.find((model) => model.resourceKey === selectedModelKey)

  const [message, setMessage] = useState('')
  const sendAppendMessage = useMutation(api.db.threads.append)

  return (
    <div className="h-full w-full overflow-y-auto p-2 pt-0 sm:pl-0 sm:pt-2">
      <Card className="mx-auto min-h-64 w-full max-w-xl space-y-4">
        <h1 className="wt-title-3">Start a new Chat</h1>
        <div className="mx-auto grid grid-cols-2 justify-items-center gap-2">
          {displayModels?.map((model) => (
            <ChatModelCard
              key={model._id}
              model={model}
              className={cn(
                'cursor-pointer',
                selectedModelKey === model.resourceKey ? 'outline outline-2 outline-accent-11' : '',
              )}
              onClick={() => setSelectedModelKey(model.resourceKey)}
            />
          ))}
          {!chatModels && (
            <>
              <ChatModelCardSkeleton />
              <ChatModelCardSkeleton />
              <ChatModelCardSkeleton />
              <ChatModelCardSkeleton />
            </>
          )}
        </div>

        <div className="space-y-3">
          <TextareaAutosize minRows={6} rows={6} value={message} onValueChange={setMessage} />
          <div className="shrink-0 gap-3 flex-between">
            <div className="flex items-center gap-2">
              <Chat className="size-6" />
              {selectedModel?.name}
            </div>
            <Button
              size="3"
              onClick={() => {
                if (!selectedModel) return

                sendAppendMessage({
                  message: {
                    content: message,
                  },
                  inference: {
                    type: 'chat-completion',
                    endpoint: selectedModel?.endpoint,
                    endpointModelId: selectedModel?.endpointModelId,
                    resourceKey: selectedModel?.resourceKey,
                  },
                }).then(({ slug }) => {
                  setMessage('')
                  router.push(`/c/${slug}`)
                })
              }}
            >
              Send
              <PaperPlaneRight className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
