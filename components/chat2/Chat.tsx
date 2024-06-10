'use client'

import { Card, IconButton, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { MessagesSquareIcon, PaperclipIcon, SendHorizonalIcon } from 'lucide-react'

import { ChatProvider, useChat } from '@/components/chat/ChatProvider'
import { api } from '@/convex/_generated/api'
import { useModelData } from '@/lib/hooks'
import { cn, getThreadConfig } from '@/lib/utils'

export const ChatComponent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  const config = getThreadConfig(thread)
  const { getModel } = useModelData()
  const currentModel = getModel(config.current.endpoint, config.current.model)

  const messages = useQuery(
    api.db.messages.list,
    thread
      ? {
          threadId: thread._id,
        }
      : 'skip',
  )
  return (
    <Card
      {...props}
      className={cn('card-translucent-1 grid h-full w-full overflow-hidden', className)}
    >
      <Inset side="all" className="flex flex-col overflow-hidden">
        {/* header bar */}
        <div className="h-10 shrink-0 border-b border-grayA-3 flex-between">
          <div className="gap-2 pl-3 flex-start">
            <IconButton variant="ghost">
              <MessagesSquareIcon className="size-4" />
            </IconButton>
            <div className="text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
          </div>
        </div>

        {/* body */}
        <div className="flex grow overflow-hidden">
          {/* details */}
          <div className="w-72 shrink-0 border-r border-grayA-3 p-4">
            <div className="text-sm font-medium">{currentModel.name}</div>
          </div>

          {/* content feed */}
          <div className="flex grow flex-col gap-3 overflow-hidden">
            <div className="grow space-y-3 overflow-y-auto py-3 pl-3 pr-6">
              {messages?.map((message) => (
                <div key={message._id} className="shrink-0 space-y-1">
                  <div className="flex items-center gap-2 px-1">
                    <div className="text-sm font-medium">{message.name ?? message.role}</div>
                    <div className="text-xs font-medium text-gray-11">
                      {formatDistanceToNow(new Date(message._creationTime), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="space-y-2 rounded-md bg-black/20 p-2 text-sm">
                    {message.content?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* input */}
            <div className="absolute inset-x-6 bottom-2 h-24 shrink-0 rounded-lg border border-grayA-3 bg-black/50 p-2 text-sm text-gray-10 backdrop-blur-3xl">
              Send a message...
              <div className="absolute bottom-3 right-2 gap-1 flex-end">
                <IconButton variant="ghost" size="2" color="gray">
                  <PaperclipIcon className="size-5" />
                </IconButton>
                <IconButton variant="ghost" size="2">
                  <SendHorizonalIcon className="size-5" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* footer bar */}
        <div className="h-6 shrink-0 border-t border-grayA-3 text-sm flex-start"></div>
      </Inset>
    </Card>
  )
}

type ChatProps = { slug: string; onClose?: (slug: string) => void } & React.ComponentProps<'div'>

export const Chat = ({ slug, onClose, ...props }: ChatProps) => {
  return (
    <ChatProvider slug={slug} onClose={onClose}>
      <ChatComponent {...props} />
    </ChatProvider>
  )
}
