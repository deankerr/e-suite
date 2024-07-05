import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'

import { useChat } from '@/components/chat/ChatProvider'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { useViewerDetails } from '@/lib/queries'
import { getWidthHeightForEndpoint } from '@/lib/utils'
import { DimensionsControl } from './DimensionsControl'
import { QuantityControl } from './QuantityControl'

import type { TextToImageConfig } from '@/convex/types'

export const MessageInput = () => {
  const { appendMessage, updateThread, thread } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)
  const [input, setInput] = useState('')

  if (!thread || (!isOwner && !thread.slug.startsWith('_'))) return null

  const handleAppendMessage = async (runInference: boolean) => {
    if (!thread) return
    const prompt = input

    if (!runInference) {
      if (prompt) {
        await appendMessage({
          message: { content: prompt },
        })
      }
      return
    }

    if (thread.inference.type === 'chat-completion') {
      if (prompt) {
        await appendMessage({
          message: { content: prompt },
          inference: thread.inference,
        })
      } else {
        await appendMessage({
          inference: thread.inference,
        })
      }

      setInput('')
    }

    if (thread.inference.type === 'text-to-image' && prompt) {
      await appendMessage({
        inference: { ...thread.inference, prompt },
      })
      setInput('')
    }
  }

  const handleUpdateTTIConfig = async (parameters: Partial<TextToImageConfig>) => {
    if (thread?.inference.type !== 'text-to-image') return
    await updateThread({
      inference: {
        ...thread.inference,
        ...parameters,
      },
    })
  }

  return (
    <div className="flex w-full shrink-0 flex-col justify-center gap-2 border-t border-grayA-3 px-3 pb-2 pt-2">
      <TextareaAutosize
        value={input}
        onValueChange={(value) => setInput(value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void handleAppendMessage(true)
          }
        }}
      />

      <div className="shrink-0 gap-2 flex-between">
        <div className="shrink-0 gap-3 flex-start">
          {thread && thread.inference.type === 'chat-completion' && (
            <Button color="gray" variant="soft" disabled>
              User
            </Button>
          )}

          {thread && thread.inference.type === 'text-to-image' && (
            <div className="shrink-0 gap-3 flex-between">
              <QuantityControl
                n={thread.inference.n}
                onValueChange={(n) => void handleUpdateTTIConfig({ n: Number(n) })}
              />
              <DimensionsControl
                width={thread.inference.width}
                height={thread.inference.height}
                onValueChange={async (size: string) => {
                  const { width, height } = getWidthHeightForEndpoint(
                    size,
                    thread.inference.endpoint,
                  )
                  void handleUpdateTTIConfig({ width, height })
                }}
              />
            </div>
          )}
        </div>

        <div className="shrink-0 gap-3 flex-end">
          <IconButton
            color="gray"
            onClick={() => {
              if (!input) return
              void appendMessage({
                inference: {
                  type: 'sound-generation',
                  resourceKey: 'elevenlabs::sound-generation',
                  endpoint: 'elevenlabs',
                  endpointModelId: 'sound-generation',
                  prompt: input,
                },
              })
            }}
          >
            <Icons.CassetteTape className="size-5" />
          </IconButton>

          <Button color="gray" onClick={() => void handleAppendMessage(false)}>
            Add
          </Button>
          <Button onClick={() => void handleAppendMessage(true)}>
            Send
            <Icons.PaperPlaneRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
