import { Card, IconButton, Inset } from '@radix-ui/themes'
import { MessagesSquareIcon, XIcon } from 'lucide-react'

import { ChatViewApiProvider } from '@/components/chat/ChatApiProvider'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

import type { E_Thread } from '@/convex/shared/types'

type ChatProps = { thread: E_Thread | null | undefined } & React.ComponentProps<typeof Card>

const ChatComponent = ({ thread, className, ...props }: ChatProps) => {
  return (
    <Card {...props} className={cn('flex h-full w-full flex-col overflow-hidden', className)}>
      <Inset side="top" className="h-10 shrink-0 border-b px-1 text-sm flex-between">
        <div className="shrink-0 flex-start">
          <IconButton variant="ghost" className="m-0 shrink-0">
            <MessagesSquareIcon className="size-5" />
          </IconButton>
        </div>

        {thread && <div className="grow truncate flex-start">{thread?.title ?? 'new thread'}</div>}
        {thread && <div className="shrink-0 text-xs text-gray-10 flex-start">{thread.slug}</div>}
        {thread === undefined && <LoadingSpinner />}

        <div className="shrink-0 gap-2 flex-end">
          <IconButton variant="ghost" className="m-0 shrink-0">
            <XIcon className="size-5" />
          </IconButton>
        </div>
      </Inset>

      <div className="grow overflow-hidden">{thread && <ChatMessages thread={thread} />}</div>

      <Inset side="bottom" className="h-10 shrink-0 border-t px-1 text-sm flex-between">
        Footer
      </Inset>
    </Card>
  )
}

export const Chat = (props: ChatProps) => {
  const threadId = props.thread?.slug ?? ''
  return (
    <ChatViewApiProvider threadId={threadId}>
      <ChatComponent {...props} />
    </ChatViewApiProvider>
  )
}
