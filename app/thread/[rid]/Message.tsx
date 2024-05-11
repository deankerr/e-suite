import { Card, Heading, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { GeneratedImageView } from '@/components/images/GeneratedImageView'
import { api } from '@/convex/_generated/api'
import { useMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

const thumbnailHeightPx = 256

type MessageProps = {
  rid: string
  priority?: boolean
}

export const Message = ({ rid, priority = false }: MessageProps) => {
  const message = useMessage(rid)
  const { images } = message

  const removeMessage = useMutation(api.messages.remove)

  const viewType = {
    text: !images,
    image: !!images,
  }

  const icon = viewType.image ? (
    <ImageIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  ) : (
    <MessageSquareIcon className="mr-1 size-6 stroke-[1.5] text-orange-11" />
  )

  const title = message?.name ?? getRole(message.role)
  // const title = generations?.[0] ? generations?.[0].prompt : message?.name ?? getRole(message.role)

  // const errors = new Set(
  //   generations
  //     ?.filter((generation) => generation.result?.type === 'error')
  //     .map((generation) => generation.result!.message),
  // )
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
              {/* {[...errors].map((message) => (
                <ErrorCallout
                  key={message}
                  title="(sinkin.ai) endpoint returned error:"
                  message={message}
                />
              ))} */}
              {images?.map((generation) => {
                // if (generation.result?.type === 'error') return null
                return (
                  <GeneratedImageView
                    key={generation._id}
                    generation={generation}
                    containerHeight={thumbnailHeightPx}
                    imageProps={{ priority }}
                    enablePageLink
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
