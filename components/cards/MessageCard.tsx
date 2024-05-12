import { Button, Card, IconButton, Inset, ScrollArea } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { GeneratedImageView } from '@/components/images/GeneratedImageView'
import { api } from '@/convex/_generated/api'
import { useMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { ButtonProps } from '@radix-ui/themes'

const thumbnailHeightPx = 256

type MessageProps = {
  rid: string
  priority?: boolean
}

export const MessageCard = ({ rid, priority = false }: MessageProps) => {
  const message = useMessage(rid)
  const { images } = message

  const removeMessage = useMutation(api.messages.remove)

  const viewType = {
    text: message.text,
    image: images.length > 0,
  }

  const icon = viewType.image ? (
    <ImageIcon className="size-5" />
  ) : (
    <MessageSquareIcon className="size-5" />
  )

  const title = images?.[0]
    ? images?.[0].parameters?.prompt
    : message?.name ?? getRole(message.role)

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

        {viewType.text && <div className="min-h-6">{quickFormat(message.text)}</div>}

        {viewType.image && (
          <ScrollArea scrollbars="horizontal" type="auto">
            <div className={cn('h-64 gap-2 flex-center')}>
              {/* {[...errors].map((message) => (
                <ErrorCallout
                  key={message}
                  title="(sinkin.ai) endpoint returned error:"
                  message={message}
                />
              ))} */}
              {images?.map((generation) => {
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

const getRoleColor = (role: string) => {
  const fallback = 'orange'

  const colors: Record<string, ButtonProps['color']> = {
    user: 'orange',
    assistant: 'blue',
    system: 'grass',
  }
  return colors[role] ?? fallback
}

const quickFormat = (text = '') => {
  const p = text.split('\n').filter((t) => t)
  return (
    <div className="mx-auto flex flex-col gap-3 text-base">
      {p.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </div>
  )
}
