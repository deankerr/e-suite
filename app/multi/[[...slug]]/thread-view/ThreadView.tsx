'use client'

import { useState } from 'react'
import { SegmentedControl } from '@radix-ui/themes'
import {
  Grid2X2Icon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SquareIcon,
} from 'lucide-react'

import { MessageCard } from '@/app/multi/[[...slug]]/MessageCard'
import { ModelCombobox } from '@/components/model-picker/ModelCombobox'
import { chatModels, imageModels } from '@/convex/shared/models'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ThreadViewProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const ThreadView = ({ thread }: ThreadViewProps) => {
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

  const showSettings = false
  return (
    <>
      {/* body */}
      <div className="flex grow flex-col gap-4 p-3">
        {showSettings && settings}

        {thread?.messages?.map((message) => (
          <MessageCard key={message._id} slug={thread.slug} message={message} />
        ))}
      </div>
    </>
  )
}
