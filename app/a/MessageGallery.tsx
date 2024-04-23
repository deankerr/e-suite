import { Card, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { ImageThumb } from '@/components/ImageThumb'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

import type { Doc } from '@/convex/_generated/dataModel'
import type SinkinInfo from '@/convex/providers/sinkin.models.json'

const thumbnailHeightRem = 16

type MessageGalleryProps = {
  message: Doc<'messages'>
  generations: {
    generation: Doc<'generations'>
    model?: (typeof SinkinInfo.models)[number]
    generated_images: Doc<'generated_images'>[]
  }[]
}

export const MessageGallery = ({ message, generations }: MessageGalleryProps) => {
  const images = generations.map(({ generated_images }) => generated_images).flat()
  const removeMessage = useMutation(api.messages.remove)

  const type = {
    text: generations.length === 0,
    image: generations.length > 0,
  }

  const icon = generations.length ? (
    <ImageIcon className="mr-1 size-5" />
  ) : (
    <MessageSquareIcon className="mr-1 size-5" />
  )

  const firstGeneration = generations.at(0)
  const title = firstGeneration
    ? firstGeneration.generation.prompt
    : message?.name ?? getRole(message.role)

  return (
    <Card className="">
      <div className="space-y-3">
        <Inset side="top">
          <div className="h-10 bg-gray-3 p-2 flex-between">
            <div className="shrink-0">{icon}</div>

            <div className="grow truncate">{title}</div>

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

        {message.content && <div className="min-h-6">{message.content}</div>}

        {type.image && (
          <ScrollArea scrollbars="horizontal" type="auto">
            <div className={cn('h-64 gap-2 overflow-x-auto flex-start')}>
              {images.map((image, i) => (
                <ImageThumb
                  key={image._id}
                  style={{ width: `${(thumbnailHeightRem / image.height) * image.width}rem` }}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  image={image}
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

// className={cn(
//   'w-1/4 px-1 py-1',
//   image.width > image.height && 'w-1/2',
//   image.width < image.height && 'w-1/4',
// )}

/* <Masonry>
            {images.map((image) => (
              <div key={image._id} className={cn('mx-auto w-full p-1 sm:w-1/2 md:w-1/3 lg:w-1/4')}>
                <ImageThumb className="" image={image} />
              </div>
            ))}
          </Masonry> */
