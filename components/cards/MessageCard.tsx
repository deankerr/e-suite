import { Fragment } from 'react'
import { Button, Card, IconButton, Inset } from '@radix-ui/themes'
import { ImageIcon, MessageSquareIcon, ShareIcon, Trash2Icon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { toast } from 'sonner'

import { GoldSparkles } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { useRemoveMessage, useThread } from '@/lib/api'
import { useRouteKeys } from '@/lib/hooks'
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

  const hasImages = images && images.length > 0

  const icon = hasImages ? (
    <ImageIcon className="size-5" />
  ) : (
    <MessageSquareIcon className="size-5" />
  )

  const title = hasImages ? 'Generation' : message?.name ?? getRole(message.role)
  // const title = images?.[0]
  //   ? images?.[0].parameters?.prompt
  //   : message?.name ?? getRole(message.role)

  const showLoader = message.jobs?.find(
    (job) =>
      job.type !== 'title-completion' && (job.status === 'queued' || job.status === 'active'),
  )

  const keys = useRouteKeys()
  const { thread } = useThread(keys)

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
            <div className="grow truncate text-sm font-semibold">{title}</div>

            <div className="flex-none gap-1.5 flex-end">
              <IconButton variant="surface" size="1" asChild>
                <Link href={`/t/${thread?.slug}/${message.series}`}>
                  <ShareIcon className="size-4" />
                </Link>
              </IconButton>

              {/* role */}
              <Button
                variant="surface"
                size="1"
                className="font-mono"
                color={getRoleColor(message.role) && 'orange'}
              >
                {message.role}
              </Button>

              {/* <IconButton variant="surface" size="1" className="font-serif text-sm">
                i
              </IconButton> */}

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

        {showLoader && (
          <div className="h-72">
            <GoldSparkles />
          </div>
        )}

        {message.images && message.images.length > 0 && (
          <div className="mx-auto grid w-fit grid-cols-2 gap-2">
            {message.images?.map((image) => (
              <Link
                key={image._id}
                href={`/t/${thread?.slug}/${message.series}/${(message.files?.findIndex((f) => f.id === image._id) ?? -9) + 1}`}
              >
                <ImageCard image={image} />
              </Link>
            ))}
          </div>
        )}

        {message.content && (
          <div className="prose prose-stone prose-invert mx-auto min-h-6 max-w-none prose-h1:mb-2 prose-h1:text-xl prose-h2:mb-2 prose-h2:mt-1 prose-h2:text-xl prose-h3:mb-2 prose-h3:mt-1 prose-pre:p-0">
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

        {message.jobs && message.jobs.length > 0 && (
          <div className="flex flex-wrap gap-3 font-mono text-xs">
            {message.jobs.map((job, i) => (
              <div key={i} className={cn(job.status === 'failed' && 'text-red-10')}>
                [{job.type}: {job.status} {job.time && `${(job.time / 1000).toFixed(2)}s`}]
              </div>
            ))}
          </div>
        )}
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
