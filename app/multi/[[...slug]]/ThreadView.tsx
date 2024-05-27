'use client'

import { useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { DotIcon, SendHorizonalIcon, XIcon } from 'lucide-react'

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
  const newThreadPickers = (
    <>
      <ModelCombobox value={chatModel} onValueChange={setChatModel} models={chatModels} />
      <ModelCombobox value={imageModel} onValueChange={setImageModel} models={imageModels} />
    </>
  )

  return (
    <div
      {...props}
      className={cn('flex min-w-96 max-w-4xl flex-[1_1_24rem] flex-col overflow-y-auto', className)}
    >
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

      <div className="flex grow flex-col gap-4 p-3">
        {thread?.messages?.map((message) => (
          <MessageCard key={message._id} slug={thread.slug} message={message} />
        ))}

        {!slug && newThreadPickers}
      </div>

      <div className="sticky bottom-0 z-10 border-t bg-gray-1 p-3 text-base flex-center">
        <TextareaAuto />
        <IconButton variant="ghost" size="2" className="absolute bottom-4 right-5 my-0 -mb-[1px]">
          <SendHorizonalIcon className="size-6" />
        </IconButton>
      </div>
    </div>
  )
}
