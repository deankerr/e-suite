import { Card, Heading, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { GenerationImage } from '@/components/images/GenerationImage'
import { ErrorCallout } from '@/components/ui/Callouts'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

import type { MessageContent, Thread } from '@/convex/external'

const thumbnailHeightPx = 256

type ThreadMessageProps = {
  thread: Thread
  priority?: boolean
} & MessageContent

export const ThreadMessage = ({ message, generations, priority = false }: ThreadMessageProps) => {
  const removeMessage = useMutation(api.messages.remove)

  const viewType = {
    text: !generations,
    image: !!generations,
  }

  const icon = viewType.image ? (
    <ImageIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  ) : (
    <MessageSquareIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  )

  const title = generations?.[0] ? generations?.[0].prompt : message?.name ?? getRole(message.role)

  const errors = new Set(
    generations
      ?.filter((generation) => generation.result?.type === 'error')
      .map((generation) => generation.result!.message),
  )
  return (
    <Card>
      <div className="space-y-3">
        <Inset side="top">
          <div className="h-10 bg-gray-3 p-2 flex-between">
            <div className="shrink-0">{icon}</div>

            <Heading size="3" className="grow truncate">
              <Link href={`/message/${message.rid}`}>{title}</Link>
            </Heading>

            <div className="shrink-0">
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
                <Trash2Icon className="size-4 stroke-[1.5]" />
              </IconButton>
            </div>
          </div>
        </Inset>

        {viewType.text && <div className="min-h-6">{message.text}</div>}

        {viewType.image && (
          <ScrollArea scrollbars="horizontal" type="auto">
            <div className={cn('h-64 gap-2 flex-start')}>
              {[...errors].map((message) => (
                <ErrorCallout
                  key={message}
                  title="(sinkin.ai) endpoint returned error:"
                  message={message}
                />
              ))}
              {generations?.map((generation) => {
                if (generation.result?.type === 'error') return null
                return (
                  <GenerationImage
                    key={generation._id}
                    generation={generation}
                    containerHeight={thumbnailHeightPx}
                    imageProps={{ priority }}
                  />
                )
              })}
            </div>
          </ScrollArea>
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
