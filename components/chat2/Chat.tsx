'use client'

import { Card, IconButton, Inset } from '@radix-ui/themes'
import { MessagesSquareIcon } from 'lucide-react'

import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { ChatProvider, useChat } from '@/components/chat/ChatProvider'
import { ChatFeed } from '@/components/chat2/ChatFeed'
import { MessageInput } from '@/components/message-input/MessageInput'
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

  return (
    <Card {...props} className={cn('grid h-full w-full overflow-hidden', className)}>
      <Inset side="all" className="flex flex-col overflow-hidden">
        {/* header bar */}
        <div className="h-10 shrink-0 border-b border-grayA-3 flex-between">
          <div className="gap-2 pl-3 flex-start">
            <IconButton variant="ghost">
              <MessagesSquareIcon className="size-5" />
            </IconButton>
            <div className="text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
          </div>
        </div>

        {/* body */}
        <div className="flex grow overflow-hidden">
          {/* details */}
          <div className="w-80 shrink-0 border-r border-grayA-3 p-4">
            {chatModel && <ChatModelCard model={chatModel} className="mx-auto" />}
            {imageModel && <ImageModelCard model={imageModel} className="mx-auto" />}
            {/* <Pre className="h-fit">{JSON.stringify(currentModel, null, 2)}</Pre> */}
          </div>

          {/* content */}
          <div className="flex grow flex-col items-center gap-1 overflow-hidden py-1 pb-2">
            <ChatFeed />

            {/* input */}
            <MessageInput className="mx-auto max-w-3xl shrink-0" />
          </div>
        </div>

        {/* footer bar */}
        {/* <div className="h-6 shrink-0 border-t border-grayA-3 text-sm flex-start"></div> */}
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
