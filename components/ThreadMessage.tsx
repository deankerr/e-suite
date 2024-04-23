import { Card, Heading, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { ImageThumb } from '@/components/ImageThumb'
import { Skeleton } from '@/components/ui/Skeleton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

import type { Doc } from '@/convex/_generated/dataModel'
import type { ImageModel } from '@/convex/types'

const thumbnailHeightRem = 16

type ThreadMessageProps = {
  message: Doc<'messages'>
  generations: {
    generation: Doc<'generations'>
    model?: ImageModel
    generated_images: Doc<'generated_images'>[]
  }[]
  thread: Doc<'threads'>
  priority?: boolean
}

export const ThreadMessage = ({ message, generations, priority = false }: ThreadMessageProps) => {
  const removeMessage = useMutation(api.messages.remove)

  const viewType = {
    text: generations.length === 0,
    image: generations.length > 0,
  }

  const icon = generations.length ? (
    <ImageIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  ) : (
    <MessageSquareIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  )

  const firstGeneration = generations.at(0)
  const title = firstGeneration
    ? firstGeneration.generation.prompt
    : message?.name ?? getRole(message.role)

  const imageList = generations.flatMap(({ generation, generated_images }) => {
    return Array.from({ length: generation.n }).map((_, i) => {
      const image = generated_images[i]
      return image ? image : { width: generation.width, height: generation.height, skeleton: true }
    })
  })

  return (
    <Card>
      <div className="space-y-3">
        <Inset side="top">
          <div className="h-10 bg-gray-3 p-2 flex-between">
            <div className="shrink-0">{icon}</div>

            <Heading size="3" className="grow truncate">
              <Link href={`/message/${message.slugId}`}>{title}</Link>
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

        {viewType.text && <div className="min-h-6">{message.content}</div>}

        {viewType.image && (
          <ScrollArea scrollbars="horizontal" type="auto">
            <div className={cn('h-64 gap-2 flex-start')}>
              {imageList.map((image, i) =>
                'skeleton' in image ? (
                  <Skeleton
                    key={i}
                    className="h-full bg-gold-3"
                    style={{ width: `${(thumbnailHeightRem / image.height) * image.width}rem` }}
                  />
                ) : (
                  <ImageThumb
                    key={image._id}
                    style={{ width: `${(thumbnailHeightRem / image.height) * image.width}rem` }}
                    priority={priority}
                    image={image}
                  />
                ),
              )}
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
