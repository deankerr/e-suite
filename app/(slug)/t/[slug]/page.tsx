'use client'

import { AlertDialog, Button, Card } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { IconButton } from '@/components/ui/IconButton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function TSlugPage({ params }: { params: { slug: string } }) {
  const thread = useQuery(api.threads.getBySlug, { slug: params.slug })
  const messages = useQuery(
    api.messages.list,
    thread ? { threadId: thread?._id, limit: 100 } : 'skip',
  )

  const textToImageMessages = messages?.filter((msg) => msg.inference?.type === 'textToImage')

  return (
    <div className="container p-4">
      <Card className="min-h-full">
        <div className="text-lg font-semibold">textToImage messages</div>
        <div className="space-y-2 py-2">
          {textToImageMessages?.map((message) => {
            if (message.inference?.type !== 'textToImage') return null
            return (
              <div key={message._id} className="flex gap-2">
                <div className="flex-center shrink-0 gap-2 rounded border px-4 py-2 text-center font-code text-sm text-gray-9">
                  <RemoveMessageDialog messageId={message._id}>
                    <IconButton lucideIcon={Trash2Icon} color="red" />
                  </RemoveMessageDialog>

                  <div>
                    <div>[{message.slug}]</div>
                    <div>{message.permissions?.public ? 'public' : 'private'}</div>
                  </div>

                  <MessageSquareIcon />
                </div>

                <Link
                  href={`/m/${message.slug}`}
                  className="flex items-center rounded-4 border px-4 py-2"
                >
                  <div>
                    {message.inference.title}
                    <span className="text-gray-11"> - {message.inference.byline}</span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

type RemoveMessageDialogProps = { messageId: Id<'messages'> } & React.ComponentProps<'div'>

const RemoveMessageDialog = ({ messageId, children, ...props }: RemoveMessageDialogProps) => {
  const removeMessage = useMutation(api.messages.remove)

  const send = () => {
    removeMessage({ messageId })
      .then(() => toast.success('Message deleted.'))
      .catch((error) => {
        console.error(error)
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred.')
        }
      })
  }

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>

      <AlertDialog.Content className="max-w-xs">
        <AlertDialog.Title>Delete message</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This insightful yet witty exchange will be gone forever.
        </AlertDialog.Description>

        <div className="mt-rx-4 flex justify-end gap-rx-3">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={() => send()}>
            <Button variant="solid" color="red">
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
