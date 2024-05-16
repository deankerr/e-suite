import { Fragment } from 'react'
import { Button, Card, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { toast } from 'sonner'

import { ImageCard } from '@/components/images/ImageCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { useRemoveMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { MessageWithContent } from '@/convex/threads/query'
import type { ButtonProps } from '@radix-ui/themes'

// const thumbnailHeightPx = 256

type MessageProps = {
  message: MessageWithContent
  priority?: boolean
}

export const MessageCard = ({ message }: MessageProps) => {
  const { images } = message

  const removeMessage = useRemoveMessage()

  const viewType = {
    text: message.content,
    image: images && images.length > 0,
  }

  const icon = viewType.image ? (
    <ImageIcon className="size-5" />
  ) : (
    <MessageSquareIcon className="size-5" />
  )

  const title = message?.name ?? getRole(message.role)
  // const title = images?.[0]
  //   ? images?.[0].parameters?.prompt
  //   : message?.name ?? getRole(message.role)

  return (
    <Card className={cn('mx-auto max-w-4xl')}>
      <div className="space-y-3">
        <Inset side="top">
          <div className="h-10 gap-2 bg-gray-3 p-2 flex-between">
            {/* message type icon */}
            <div className="flex-none flex-start">
              <IconButton variant="ghost" size="1">
                {icon}
              </IconButton>
            </div>

            {/* title */}
            <div className="grow truncate text-sm font-semibold">
              <Link href={`/message/${message.rid}`}>{title}</Link>
            </div>

            <div className="flex-none gap-1.5 flex-end">
              {/* role */}
              <Button
                variant="surface"
                size="1"
                className="font-mono"
                color={getRoleColor(message.role)}
              >
                {message.role}
              </Button>

              <IconButton variant="surface" size="1" className="font-serif text-sm">
                i
              </IconButton>

              {/* delete */}
              <IconButton
                color="red"
                size="1"
                variant="surface"
                onClick={() => {
                  removeMessage({ messageId: message._id })
                    .then(() => toast.success('Message removed'))
                    .catch((err) => {
                      if (err instanceof Error) toast.error(err.message)
                      else toast.error('Unknown error')
                    })
                }}
              >
                <Trash2Icon className="size-4" />
              </IconButton>
            </div>
          </div>
        </Inset>

        {/* {viewType.text && <div className="min-h-6">{quickFormat(message?.content)}</div>} */}

        {viewType.text && (
          <div className="prose prose-invert prose-stone prose-pre:p-0 mx-auto min-h-6 max-w-none">
            <Markdown
              options={{
                wrapper: Fragment,
                overrides: {
                  code: SyntaxHighlightedCode,
                },
              }}
            >
              {message?.content ?? ''}
            </Markdown>
          </div>
        )}
        {viewType.image && (
          <ScrollArea scrollbars="horizontal" type="auto">
            <div className="mx-auto grid w-fit grid-cols-2 place-content-center gap-2">
              {images?.map((image) => <ImageCard key={image._id} image={image} />)}
            </div>
          </ScrollArea>
        )}

        <div className="flex flex-wrap gap-3 font-mono text-xs">
          {message?.jobs?.map((job, i) => (
            <div key={i} className="">
              [{job.type}: {job.status} {job.time && `${(job.time / 1000).toFixed(2)}s`}]
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

const getRole = (role: string) => {
  const roles: Record<string, string> = {
    user: 'User',
    assistant: 'AI',
    system: 'System',
    tool: 'Tool',
  }

  return roles[role] ?? role
}

const getRoleColor = (role: string) => {
  const fallback = 'orange'

  const colors: Record<string, ButtonProps['color']> = {
    user: 'orange',
    assistant: 'blue',
    system: 'grass',
  }
  return colors[role] ?? fallback
}

export const MessageCardSkeleton = () => {
  return (
    <Skeleton className="mx-auto min-h-32 w-full max-w-4xl">
      <Skeleton className="h-10 rounded-b-none bg-gray-3" />
    </Skeleton>
  )
}
