'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, ScrollArea } from '@radix-ui/themes'

import { Message } from '@/app/dev/lo36/c/[thread]/_components/Message'
import { Sidebar } from '@/app/dev/lo36/c/[thread]/_components/Sidebar'
import { useMessagesList, useThread } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const ChatPage = ({
  slug,
  className,
  ...props
}: { slug: string } & React.ComponentProps<'div'>) => {
  const thread = useThread({ slug })
  const messages = useMessagesList({ slugOrId: slug })

  return (
    <div {...props} className={cn('flex h-full w-full', className)}>
      {/* * feed * */}
      <ScrollArea scrollbars="vertical" className="w-full">
        <div className="mx-auto flex w-full max-w-3xl flex-col-reverse items-center px-1">
          <div className="mx-auto my-3 shrink-0">
            <Icons.DiamondsFour className="size-6 text-gray-10" />
          </div>
          {messages.results.map((message) => (
            <Message key={message._id} message={message} />
          ))}
          <div className="mx-auto my-3 shrink-0">
            <Icons.CirclesThree className="size-6 text-gray-10" />
          </div>
        </div>
      </ScrollArea>

      {/* * sidebar * */}
      {thread && <Sidebar thread={thread} />}
    </div>
  )
}
