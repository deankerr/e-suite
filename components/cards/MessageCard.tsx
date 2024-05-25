import { Fragment, useState } from 'react'
import { Card, IconButton, Inset, Tabs } from '@radix-ui/themes'
import { ImageIcon, MessageSquareIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { toast } from 'sonner'

import { MessageEditor } from '@/components/cards/message-card/MessageEditor'
import { GoldSparkles } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { useRemoveMessage, useSelf } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EMessageContent } from '@/convex/shared/schemas'

type MessageProps = {
  slug?: string
  message: EMessageContent
  file?: number
  priority?: boolean
} & React.ComponentProps<typeof Card>

export const MessageCard = ({ slug = '', message, file, ...props }: MessageProps) => {
  const self = useSelf()
  const selfIsOwner = self?._id === message.user?._id
  const selfIsAdmin = self?.role === 'admin'

  const removeMessage = useRemoveMessage()

  const { files, inference } = message

  const title =
    inference?.type === 'text-to-image'
      ? inference.parameters.prompt
      : message?.name ?? getRole(message.role)

  const incompleteJobs = message.jobs.filter(
    (job) => job.status === 'queued' || job.status === 'active',
  )
  const showLoader =
    incompleteJobs.filter((job) => ['text-to-image', 'chat-completion'].includes(job.name)).length >
    0

  const [showRawContent, setShowRawContent] = useState(false)
  return (
    <Card {...props}>
      <div className="space-y-3">
        <Inset side="top">
          <div className="h-10 gap-1 bg-gray-3 p-2 flex-between md:gap-2">
            {/* message type icon */}
            <div className="flex-none flex-start">
              <IconButton variant="ghost" size="1" className="[&>svg]:size-5">
                {files?.length ? <ImageIcon /> : <MessageSquareIcon />}
              </IconButton>
            </div>

            {/* title */}
            <Link
              href={`/t/${slug}/${message.series}`}
              className="grow truncate text-sm font-semibold"
            >
              {title}
            </Link>

            {selfIsOwner && (
              <div className="flex-none gap-1.5 flex-end">
                {/* edit */}
                <IconButton
                  variant="surface"
                  size="1"
                  className="hidden md:flex"
                  onClick={() => setShowRawContent(!showRawContent)}
                >
                  <PencilIcon className="size-4" />
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
            )}
          </div>
        </Inset>

        {file &&
          files?.map((f, i) => {
            if (i !== file || f.type !== 'image') return null
            return (
              <div key={f.id} className="mx-auto">
                <ImageCard image={f.image} sizes="(max-width: 56rem) 100vw, 28rem" />
              </div>
            )
          })}

        {!file && files && (
          <div className="mx-auto grid w-fit grid-cols-2 gap-2">
            {files.map((file, i) => {
              if (file.type !== 'image') return null
              return (
                <Link key={file.id} href={`/t/${slug}/${message.series}/${i + 1}`}>
                  <ImageCard image={file.image} sizes="(max-width: 56rem) 50vw, 28rem" />
                </Link>
              )
            })}
          </div>
        )}

        {message.content ? (
          showRawContent ? (
            <Tabs.Root defaultValue="edit">
              <Tabs.List>
                <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
                <Tabs.Trigger value="json">JSON</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="edit">
                <MessageEditor message={message} />
              </Tabs.Content>

              <Tabs.Content value="json">
                <Pre>{JSON.stringify(message, null, 2)}</Pre>
              </Tabs.Content>
            </Tabs.Root>
          ) : (
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
                {message.content}
              </Markdown>
            </div>
          )
        ) : null}

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

        {message.jobs && message.jobs.length > 0 && (selfIsAdmin || selfIsOwner) && (
          <div className="flex flex-wrap gap-1 font-mono text-xs">
            {message.jobs.map((job, i) => (
              <div key={i} className={cn(job.status === 'failed' && 'text-red-10')}>
                [{job.name}: {job.status}]{/* {job.time && `${(job.time / 1000).toFixed(2)}s`} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export const Pre = ({ className, ...props }: React.ComponentProps<'pre'>) => {
  return (
    <pre
      {...props}
      className={cn(
        'overflow-auto text-wrap rounded bg-gray-1 p-2 font-mono text-sm text-gray-11',
        className,
      )}
    />
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

export const MessageCardSkeleton = () => {
  return (
    <Skeleton className="mx-auto min-h-32 w-full max-w-4xl">
      <Skeleton className="h-10 rounded-b-none bg-gray-3" />
    </Skeleton>
  )
}
