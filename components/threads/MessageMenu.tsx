import { forwardRef } from 'react'
import { DropdownMenu } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

type MessageMenuProps = { messageId: Id<'messages'> } & React.ComponentProps<
  typeof DropdownMenu.Root
>

export const MessageMenu = forwardRef<HTMLButtonElement, MessageMenuProps>(function MessageMenu(
  { messageId, children, ...props },
  forwardedRef,
) {
  const runRemove = useMutation(api.threads.threads.removeMessage)

  const handleRemove = async () => {
    try {
      await runRemove({ id: messageId })
      toast.success('Message deleted.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete message.')
    }
  }

  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger ref={forwardedRef}>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item disabled>Edit</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onClick={handleRemove}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
})
