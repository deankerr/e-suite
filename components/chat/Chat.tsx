import { Card, IconButton, Inset } from '@radix-ui/themes'
import { MenuIcon, MessagesSquareIcon, XIcon } from 'lucide-react'

import { ChatInput } from '@/components/chat/chat-input/ChatInput'
import { ChatViewApiProvider } from '@/components/chat/ChatApiProvider'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { TempChatMenu } from '@/components/chat/TempChatMenu'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

import type { E_Thread } from '@/convex/shared/types'

type ChatProps = { thread: E_Thread | null | undefined } & React.ComponentProps<typeof Card>

const ChatComponent = ({ thread, className, ...props }: ChatProps) => {
  return (
    <Card {...props} className={cn('flex h-full w-full flex-col overflow-hidden', className)}>
      <Inset side="top" className="h-10 shrink-0 border-b px-1 text-sm flex-between">
        <div className="shrink-0 flex-start">
          <IconButton variant="ghost" color="cyan" className="m-0 shrink-0">
            <MenuIcon className="size-5" />
          </IconButton>

          {thread && (
            <TempChatMenu thread={thread}>
              <IconButton variant="ghost" className="m-0 shrink-0">
                <MessagesSquareIcon className="size-5" />
              </IconButton>
            </TempChatMenu>
          )}
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

      <Inset side="bottom" className="min-h-10 shrink-0 border-t px-1 text-sm flex-between">
        {thread && <ChatInput className="mx-auto max-w-3xl" thread={thread} />}
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
