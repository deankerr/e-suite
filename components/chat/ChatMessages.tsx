import { Fragment } from 'react'
import { MessageSquareIcon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { useMessagesList } from '@/lib/api2'
import { cn } from '@/lib/utils'

import type { E_Message, E_Thread } from '@/convex/shared/types'

type ChatMessagesProps = { thread: E_Thread } & React.ComponentProps<'div'>

export const ChatMessages = ({ thread, className, ...props }: ChatMessagesProps) => {
  const messages = useMessagesList(thread._id)

  if (messages.isError) return <div>Error {messages.error.message}</div>
  if (messages.isPending) return <LoadingSpinner />

  return (
    <div
      {...props}
      className={cn('flex h-full flex-col gap-2 divide-y overflow-y-auto px-2', className)}
    >
      {messages.data.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}
    </div>
  )
}

type ChatMessageProps = { message: E_Message } & React.ComponentProps<'div'>

export const ChatMessage = ({ message, className, ...props }: ChatMessageProps) => {
  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const title = textToImage ? textToImage.parameters.prompt : message?.name || message.role

  return (
    <div {...props} className={cn('py-2', className)}>
      <div className="h-8 gap-1.5 flex-start">
        <MessageSquareIcon className="size-4 flex-none text-accent-11" />
        <div className="grow truncate text-xs font-medium capitalize">{title}</div>
      </div>
      <div className="prose prose-sm prose-stone prose-invert mx-auto min-h-6 max-w-none prose-pre:p-0">
        <Markdown
          options={{
            wrapper: Fragment,
            disableParsingRawHTML: true,
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        >
          {message.content ?? '(empty)'}
        </Markdown>
      </div>
    </div>
  )
}
