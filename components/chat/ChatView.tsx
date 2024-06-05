import { Card, Inset } from '@radix-ui/themes'

import { MessageCard, MessageCardSkeleton } from '@/components/cards/message-card/MessageCard'
import { ChatInput } from '@/components/chat/chat-input/ChatInput'
import { ChatPanelApiProvider } from '@/components/chat/ChatApiProvider'
import { Header } from '@/components/chat/Header'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ChatViewProps = { thread: EThreadWithContent | null | undefined } & React.ComponentProps<'div'>

const Component = ({ thread, className, ...props }: ChatViewProps) => {
  return (
    <Card {...props} className={cn('flex h-full w-full flex-col overflow-hidden', className)}>
      <Header className="shrink-0" thread={thread} />
      <Body className="grow" thread={thread} />
      <Footer className="shrink-0" thread={thread} />
    </Card>
  )
}

export const ChatView = (props: ChatViewProps) => {
  return (
    <ChatPanelApiProvider>
      <Component {...props} />
    </ChatPanelApiProvider>
  )
}

type BodyProps = { thread: EThreadWithContent | null | undefined } & React.ComponentProps<'div'>
export const Body = ({ thread, className, ...props }: BodyProps) => {
  return (
    <div
      {...props}
      className={cn('flex h-full w-full flex-col gap-4 overflow-y-auto p-3', className)}
    >
      {thread === undefined && <MessageCardSkeleton className="mx-auto max-w-2xl" />}
      {thread === null && <div>error</div>}
      {thread &&
        thread.messages.map((message) => (
          <MessageCard key={message._id} message={message} className="mx-auto max-w-2xl shrink-0" />
        ))}
    </div>
  )
}

type FooterProps = { thread: EThreadWithContent | null | undefined } & React.ComponentProps<
  typeof Inset
>
export const Footer = ({ thread, ...props }: FooterProps) => {
  return (
    <Inset side="bottom" {...props}>
      <div className="min-h-14 rounded bg-gray-1">{thread && <ChatInput thread={thread} />}</div>
    </Inset>
  )
}
