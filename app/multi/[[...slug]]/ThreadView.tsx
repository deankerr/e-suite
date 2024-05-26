'use client'

import { IconButton } from '@radix-ui/themes'
import { SendHorizonalIcon } from 'lucide-react'

import { MessageCard } from '@/app/multi/[[...slug]]/MessageCard'
import { TextareaAuto } from '@/components/ui/TextareaAuto'
import { useThreadContent } from '@/lib/api'
import { cn } from '@/lib/utils'

type ThreadViewProps = { slug: [threadId: string] } & React.ComponentProps<'div'>

export const ThreadView = ({ slug, className, ...props }: ThreadViewProps) => {
  const thread = useThreadContent(slug[0])

  return (
    <div {...props} className={cn('max-w-4xl overflow-y-auto', className)}>
      <div className="sticky top-0 z-10 h-11 border-b bg-gray-1 text-sm flex-center">
        {thread?.title}
      </div>

      <div className="flex flex-col gap-4 p-2">
        {thread?.messages?.map((message) => (
          <MessageCard key={message._id} slug={thread.slug} message={message} />
        ))}
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
