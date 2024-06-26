import { useState } from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'

import { useChat } from '@/components/chat/ChatProvider'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { useViewerDetails } from '@/lib/queries'
import { getWidthHeightForEndpoint } from '@/lib/utils'
import { DimensionsControl } from './DimensionsControl'
import { QuantityControl } from './QuantityControl'

import type { ETextToImageInference } from '@/convex/shared/structures'

export const MessageInput = () => {
  const { appendMessage, updateThread, thread } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)
  const [input, setInput] = useState('')

  if (!thread || (!isOwner && !thread.slug.startsWith('_'))) return null

  const handleAppendMessage = async (runInference: boolean) => {
    if (!thread) return
    const prompt = input
    if (!prompt) return console.warn('prompt is empty')

    if (!runInference) {
      await appendMessage({
        message: { content: prompt },
      })
      return
    }

    if (thread.config.ui.type === 'chat-completion') {
      await appendMessage({
        message: { content: prompt },
        inference: thread.config.ui,
      })
      setInput('')
    }

    if (thread.config.ui.type === 'text-to-image') {
      await appendMessage({
        inference: { ...thread.config.ui, prompt },
      })
      setInput('')
    }
  }

  const handleUpdateTTIConfig = async (parameters: Partial<ETextToImageInference>) => {
    if (thread?.config.ui.type !== 'text-to-image') return
    await updateThread({
      config: {
        ...thread.config,
        ui: {
          ...thread.config.ui,
          ...parameters,
        },
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
          {thread && thread.config.ui.type === 'chat-completion' && (
            <Button color="gray" variant="soft" disabled>
              User
            </Button>
          )}

          {thread && thread.config.ui.type === 'text-to-image' && (
            <div className="shrink-0 gap-3 flex-between">
              <QuantityControl
                n={thread.config.ui.n}
                onValueChange={(n) => void handleUpdateTTIConfig({ n: Number(n) })}
              />
              <DimensionsControl
                width={thread.config.ui.width}
                height={thread.config.ui.height}
                onValueChange={async (size: string) => {
                  const { width, height } = getWidthHeightForEndpoint(
                    size,
                    thread.config.ui.endpoint,
                  )
                  void handleUpdateTTIConfig({ width, height })
                }}
              />
            </div>
          )}
        </div>

        <div className="shrink-0 gap-3 flex-end">
          {thread.config.ui.type === 'chat-completion' && (
            <Button color="gray" onClick={() => void handleAppendMessage(false)}>
              Add
            </Button>
          )}
          <Button onClick={() => void handleAppendMessage(true)}>
            Send
            <PaperPlaneRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
