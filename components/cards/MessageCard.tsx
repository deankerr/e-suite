import { Fragment, useState } from 'react'
import { Button, Card, IconButton, Inset } from '@radix-ui/themes'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { toast } from 'sonner'

import { GoldSparkles } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { useRemoveMessage } from '@/lib/api'
import { cn, getConvexSiteUrl } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'
import type { EMessageContent } from '@/convex/validators'
import type { ButtonProps } from '@radix-ui/themes'

type MessageProps = {
  slug?: string
  message: EMessageContent
  file?: number
  priority?: boolean
} & React.ComponentProps<typeof Card>

export const MessageCard = ({ slug = '', message, file, ...props }: MessageProps) => {
  const removeMessage = useRemoveMessage()

  const { images, inference, files } = message

  const title =
    inference?.type === 'text-to-image'
      ? inference.parameters.prompt
      : message?.name ?? getRole(message.role)

  const incompleteJobs = message.jobs.filter(
    (job) => job.status === 'queued' || job.status === 'active',
  )
  const showLoader =
    incompleteJobs.filter((job) => ['text-to-image', 'chat-completion'].includes(job.type)).length >
    0

  const [streamedMessage, setStreamedMessage] = useState('')
  return (
    <Card {...props}>
      <div className="space-y-3">
        <Inset side="top">
          <div className="h-10 gap-1 bg-gray-3 p-2 flex-between md:gap-2">
            {/* message type icon */}
            <div className="flex-none flex-start">
              <IconButton
                variant="ghost"
                size="1"
                className="[&>svg]:size-5"
                onClick={() => {
                  // Kick off ChatGPT response + stream the result
                  async function streamMessage() {
                    await handleGptResponse(
                      (text) => {
                        setStreamedMessage((p) => p + text)
                      },
                      { messageId: message._id },
                    )
                  }

                  void streamMessage()
                }}
              >
                {images.length ? <ImageIcon /> : <MessageSquareIcon />}
              </IconButton>
            </div>

            {/* title */}
            <Link
              href={`/t/${slug}/${message.series}`}
              className="grow truncate text-sm font-semibold"
            >
              {title}
            </Link>

            <div className="flex-none gap-1.5 flex-end">
              {/* role */}
              <Button
                variant="surface"
                size="1"
                className="hidden font-mono md:flex"
                color={getRoleColor(message.role) && 'orange'}
              >
                {message.role}
              </Button>

              {/* message series */}
              <Button variant="surface" size="1" className="hidden md:flex" asChild>
                <Link href={`/t/${slug}/${message.series}`}>
                  <span className="font-mono">{message.series}</span>
                </Link>
              </Button>

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

        {file &&
          files?.map(({ id }, i) => {
            if (i !== file) return null
            const image = images.find((image) => image._id === id)
            if (!image) return null
            return (
              <div key={id} className="mx-auto w-fit">
                <ImageCard image={image} />
              </div>
            )
          })}

        {!file && files && (
          <div className="mx-auto grid w-fit grid-cols-2 gap-2">
            {files.map((file, i) => {
              const image = images.find((image) => image._id === file.id)
              if (!image) return null
              return (
                <Link key={file.id} href={`/t/${slug}/${message.series}/${i + 1}`}>
                  <ImageCard image={image} sizes="(max-width: 56rem) 50vw, 28rem" />
                </Link>
              )
            })}
          </div>
        )}

        {message.content && (
          <div className="prose prose-stone prose-invert mx-auto min-h-6 max-w-none prose-h1:mb-2 prose-h1:text-lg prose-h2:mb-2 prose-h2:mt-1 prose-h2:text-lg prose-h3:mb-2 prose-h3:mt-1 prose-pre:p-0">
            <Markdown
              options={{
                wrapper: Fragment,
                disableParsingRawHTML: true,
                overrides: {
                  code: SyntaxHighlightedCode,
                },
              }}
            >
              {streamedMessage || message.content}
            </Markdown>
          </div>
        )}

        {showLoader && (
          <div className="h-72">
            <GoldSparkles />
          </div>
        )}

        {message.inference?.type === 'text-to-image' && (
          <div className="flex flex-wrap gap-3 font-mono text-xs">
            {message.inference.parameters.model_id}
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

async function handleGptResponse(
  onUpdate: (update: string) => void,
  requestBody: { messageId: Id<'messages'> },
) {
  const convexSiteUrl = getConvexSiteUrl()
  console.log('handleGptResponse', requestBody, convexSiteUrl)
  const response = await fetch(`${convexSiteUrl}/chat`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' },
  })
  // Taken from https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
  const responseBody = response.body
  if (responseBody === null) {
    console.log('responseBody is null')
    return
  }
  const reader = responseBody.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      onUpdate(new TextDecoder().decode(value))
      return
    }
    onUpdate(new TextDecoder().decode(value))
  }
}
