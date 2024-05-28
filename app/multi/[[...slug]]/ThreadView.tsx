'use client'

import { useState } from 'react'
import { IconButton, SegmentedControl } from '@radix-ui/themes'
import {
  DotIcon,
  Grid2X2Icon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SendHorizonalIcon,
  SquareIcon,
  XIcon,
} from 'lucide-react'

import { useThreadStack } from '@/app/multi/[[...slug]]/hooks'
import { MessageCard } from '@/app/multi/[[...slug]]/MessageCard'
import { ModelCombobox } from '@/components/model-picker/ModelCombobox'
import { TextareaAuto } from '@/components/ui/TextareaAuto'
import { chatModels, imageModels } from '@/convex/shared/models'
import { useThreadContent } from '@/lib/api'
import { cn } from '@/lib/utils'

type ThreadViewProps = { slug?: [threadId: string] } & React.ComponentProps<'div'>

export const ThreadView = ({ slug, className, ...props }: ThreadViewProps) => {
  const thread = useThreadContent(slug?.[0])
  const stack = useThreadStack()

  // todo: temp
  const [chatModel, setChatModel] = useState('openai::gpt-4o')
  const [imageModel, setImageModel] = useState('fal::fal-ai/hyper-sdxl')

  const settings = (
    <div className="mx-auto w-full max-w-96 space-y-2">
      <div className="space-y-4 rounded-md border border-gray-3 p-4 text-xs">
        Chat
        <ModelCombobox value={chatModel} onValueChange={setChatModel} models={chatModels} />
      </div>

      <div className="space-y-4 rounded-md border border-gray-3 p-4 text-xs">
        Image
        <ModelCombobox value={imageModel} onValueChange={setImageModel} models={imageModels} />
        <div className="flex-between">
          <SegmentedControl.Root>
            <SegmentedControl.Item value="1">
              <SquareIcon className="size-5" />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="4">
              <Grid2X2Icon className="" />
            </SegmentedControl.Item>
          </SegmentedControl.Root>

          <SegmentedControl.Root>
            <SegmentedControl.Item value="portrait">
              <RectangleVerticalIcon className="" />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="square">
              <SquareIcon className="size-5" />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="landscape">
              <RectangleHorizontalIcon className="" />
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
      </div>
    </div>
  )

  const showSettings = !slug
  return (
    <div
      {...props}
      className={cn('mx-auto flex flex-[1_0_min(100vw,24rem)] flex-col overflow-y-auto', className)}
    >
      {/* top bar */}
      <div className="sticky top-0 z-10 h-11 shrink-0 border-b bg-gray-1 px-2 text-sm flex-between">
        <div className="shrink-0">
          <IconButton variant="ghost" color="gray" className="pointer-events-none">
            <DotIcon />
          </IconButton>
        </div>

        <div>
          {!slug && <span className="italic text-gray-11">new</span>}
          {thread?.title}
        </div>

        <div className="shrink-0">
          <IconButton variant="ghost" color="gray" onClick={() => stack.remove(thread?.slug)}>
            <XIcon />
          </IconButton>
        </div>
      </div>

      {/* body */}
      <div className="flex grow flex-col gap-4 p-3">
        {showSettings && settings}

        {thread?.messages?.map((message) => (
          <MessageCard key={message._id} slug={thread.slug} message={message} />
        ))}
      </div>

      {/* bottom bar */}
      <div className="sticky bottom-0 z-10 border-t bg-gray-1 p-3 text-base flex-center">
        <TextareaAuto />
        <IconButton variant="ghost" size="2" className="absolute bottom-4 right-5 my-0 -mb-[1px]">
          <SendHorizonalIcon className="size-6" />
        </IconButton>
      </div>
    </div>
  )
}
