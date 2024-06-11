'use client'

import { Badge, Button, Card, IconButton, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import {
  ExternalLinkIcon,
  MessagesSquareIcon,
  PaperclipIcon,
  SendHorizonalIcon,
} from 'lucide-react'
import Link from 'next/link'

import { ChatProvider, useChat } from '@/components/chat/ChatProvider'
import { Pre } from '@/components/util/Pre'
import { api } from '@/convex/_generated/api'
import { useChatModels, useImageModels } from '@/lib/queries'
import { cn, getThreadConfig } from '@/lib/utils'

export const ChatComponent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  const config = getThreadConfig(thread)

  const chatModels = useChatModels()
  const chatModel =
    thread && chatModels.isSuccess
      ? chatModels.data.find(
          (model) =>
            model.model === config.chatCompletion?.model &&
            model.endpoint === config.chatCompletion.endpoint,
        )
      : undefined

  const imageModels = useImageModels()
  const imageModel =
    thread && imageModels.isSuccess
      ? imageModels.data.find(
          (model) =>
            model.model === config.textToImage?.model &&
            model.endpoint === config.textToImage.endpoint,
        )
      : undefined

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-redundant-type-constituents
  const currentModel = (chatModel || imageModel) as typeof chatModel & typeof imageModel

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
          <div className="w-80 shrink-0 border-r border-grayA-3 p-4">
            {currentModel && (
              <div className="space-y-3">
                <div className="">
                  <div className="text-sm font-medium text-gray-11">{currentModel.creatorName}</div>
                  <div className="text-base font-medium">{currentModel.name}</div>
                  <div className="font-mono text-xs text-gray-11">{currentModel.model}</div>
                </div>

                <div className="gap-2 flex-start">
                  <Badge color="ruby">{currentModel.endpoint}</Badge>
                  {currentModel.architecture && <Badge color="green">{currentModel.architecture}</Badge>}
                  {currentModel.contextLength && <Badge color="gray">{currentModel.contextLength}</Badge>}
                  {currentModel.link && (
                    <IconButton variant="soft" size="1" className="shrink-0" asChild>
                      <Link href={currentModel.link}>
                        <ExternalLinkIcon className="size-4" />
                      </Link>
                    </IconButton>
                  )}
                  {currentModel.civitaiModelId && (
                    <Button variant="soft" size="1" className="shrink-0" asChild>
                      <Link href={`https://civitai.com/models/${currentModel.civitaiModelId}`}>
                        civitai <ExternalLinkIcon className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="text-xs">{currentModel.description}</div>
                <Pre className="h-fit">{JSON.stringify(currentModel, null, 2)}</Pre>
              </div>
            )}
          </div>

          {/* content feed */}
          <div className="flex grow flex-col items-center gap-3 overflow-hidden">
            <div className="w-full grow space-y-3 overflow-y-auto py-3 pl-3 pr-6">
              {messages?.map((message) => (
                <div key={message._id} className="mx-auto max-w-4xl shrink-0 space-y-1">
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
            <div className="absolute bottom-2 mx-auto h-24 w-full max-w-3xl shrink-0 rounded-lg border border-grayA-3 bg-black/25 p-2 text-sm text-gray-10 backdrop-blur-3xl">
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
