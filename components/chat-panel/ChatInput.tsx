import { useState } from 'react'
import { IconButton, SegmentedControl } from '@radix-ui/themes'
import {
  Grid2X2Icon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SendHorizonalIcon,
  SquareIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { Textarea } from '@/components/ui/Textarea'
import { useCreateMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ChatInputProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const ChatInput = ({ thread, className, ...props }: ChatInputProps) => {
  const createMessage = useCreateMessage()
  const [prompt, setPrompt] = useState('')

  const textToImage = thread.active.type === 'text-to-image' ? thread.active : null

  const handleSendMessage = async () => {
    try {
      const inference = { ...thread.active }
      if (inference.type === 'text-to-image') inference.parameters.prompt = prompt

      await createMessage({ threadId: thread.slug, message: { role: 'user', content: prompt } })

      await createMessage({
        threadId: thread.slug,
        message: { role: 'assistant', inference: thread.active },
      })

      setPrompt('')
    } catch (err) {
      console.error(err)
      toast.error('An error occurred')
    }
  }
  return (
    <div {...props} className={cn('flex h-full flex-col justify-between px-3 py-2', className)}>
      {textToImage && (
        <div className="mb-2 border-b border-gray-4 pb-2 flex-between">
          <QuantityControl n={textToImage.parameters.n} />
          <DimensionsControl
            width={textToImage.parameters.width}
            height={textToImage.parameters.height}
          />
        </div>
      )}

      <div className="gap-2 flex-between">
        <Textarea
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
