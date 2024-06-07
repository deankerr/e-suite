import { useState } from 'react'
import { IconButton, SegmentedControl } from '@radix-ui/themes'
import {
  Grid2X2Icon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SendHorizonalIcon,
  SquareIcon,
} from 'lucide-react'

import { useChatViewApi } from '@/components/chat/ChatApiProvider'
import { Textarea } from '@/components/ui/Textarea'
import { useUpdateThreadConfig } from '@/lib/api'
import { cn, getThreadConfig, getWidthHeightForEndpoint } from '@/lib/utils'

import type { ETextToImageInference } from '@/convex/shared/structures'
import type { E_Thread } from '@/convex/shared/types'

type ChatInputProps = { thread: E_Thread } & React.ComponentProps<'div'>

export const ChatInput = ({ thread, className, ...props }: ChatInputProps) => {
  const api = useChatViewApi()

  const [prompt, setPrompt] = useState('')

  const { textToImage, chatCompletion } = getThreadConfig(thread)

  const handleSendMessage = async () => {
    if (textToImage) {
      await api.createMessage({
        message: {},
        inference: { ...textToImage, prompt: prompt },
      })
      setPrompt('')
    }

    if (chatCompletion) {
      await api.createMessage({
        message: { content: prompt },
        inference: chatCompletion,
      })
      setPrompt('')
    }
  }

  const { updateThreadConfig } = useUpdateThreadConfig()
  const handleUpdateTTIConfig = (parameters: Partial<ETextToImageInference>) => {
    if (!textToImage) return
    const config = {
      ...textToImage,
      ...parameters,
    }
    updateThreadConfig({ threadId: thread.slug, config })
  }

  return (
    <div
      {...props}
      className={cn('flex h-full w-full flex-col justify-between px-3 py-2', className)}
    >
      {textToImage && (
        <div className="mb-2 border-b border-gray-4 pb-2 flex-between">
          <QuantityControl
            n={textToImage.n}
            onValueChange={(n) => handleUpdateTTIConfig({ n: Number(n) })}
          />
          <DimensionsControl
            width={textToImage.width}
            height={textToImage.height}
            onValueChange={(size: string) => {
              const { width, height } = getWidthHeightForEndpoint(size, textToImage.endpoint)
              handleUpdateTTIConfig({ width, height })
            }}
          />
        </div>
      )}

      <div className="gap-2 flex-between">
        <Textarea
          rows={1}
          minHeight={1}
          placeholder="Prompt..."
          value={prompt}
          onValueChange={setPrompt}
          onKeyDown={(e) => {
            if (e.key == 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSendMessage()
            }
          }}
        />
        <IconButton variant="ghost" size="2" onClick={() => void handleSendMessage()}>
          <SendHorizonalIcon />
        </IconButton>
      </div>
    </div>
  )
}

const DimensionsControl = ({
  width,
  height,
  ...props
}: { width: number; height: number } & React.ComponentProps<typeof SegmentedControl.Root>) => {
  const ar = width / height
  const value = ar < 1 ? 'portrait' : ar > 1 ? 'landscape' : 'square'
  return (
    <SegmentedControl.Root value={value} {...props}>
      <SegmentedControl.Item value="portrait">
        <RectangleVerticalIcon className="size-5" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="square">
        <SquareIcon className="size-5" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="landscape">
        <RectangleHorizontalIcon className="size-5" />
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}

const QuantityControl = ({
  n,
  ...props
}: { n: number } & React.ComponentProps<typeof SegmentedControl.Root>) => {
  const value = n === 1 ? '1' : '4'
  return (
    <SegmentedControl.Root value={value} {...props}>
      <SegmentedControl.Item value="1">
        <SquareIcon className="size-4" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="4">
        <Grid2X2Icon className="size-5" />
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}
