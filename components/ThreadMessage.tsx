import { Card, Heading, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { ImageFile } from './images/ImageFile'

import type { Id } from '@/convex/_generated/dataModel'
import type { MessageContent, Thread } from '@/convex/external'

const thumbnailHeightRem = 16

type ThreadMessageProps = {
  thread: Thread
  priority?: boolean
} & MessageContent

export const ThreadMessage = ({
  data: message,
  generation,
  generated_images,
  priority = false,
}: ThreadMessageProps) => {
  const removeMessage = useMutation(api.messages.remove)

  const viewType = {
    text: !generation,
    image: !!generation,
  }

  const icon = viewType.image ? (
    <ImageIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  ) : (
    <MessageSquareIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  )

  const title = generation ? generation.prompt : message?.name ?? getRole(message.role)

  let count = 0
  const imageList = generation?.dimensions.flatMap(({ width, height, n }, i) => {
    return Array.from({ length: n }).map((_, j) => {
      const image = generated_images?.[count++]
      return image ? image : { width, height, rid: `*generating*${i}+${j}`, blurDataUrl: '' }
    })
  })

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
                  removeMessage({ messageId: message._id as Id<'messages'> })
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
              {imageList?.map(({ rid, width, height, blurDataUrl }) => (
                <ImageFile
                  key={rid}
                  rid={rid}
                  width={width}
                  height={height}
                  blurDataUrl={blurDataUrl}
                  priority={priority}
                  style={{ width: `${(thumbnailHeightRem / height) * width}rem` }}
                />
              ))}
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
