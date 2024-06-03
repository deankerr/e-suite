import { DropdownMenu } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useEditMessage, useRemoveMessage, useViewerDetails } from '@/lib/api'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageDropdownMenuProps = {
  message: EMessageWithContent
  onEdit: () => void
} & React.ComponentProps<typeof DropdownMenu.Root>

export const MessageDropdownMenu = ({
  message,
  onEdit,
  children,
  ...props
}: MessageDropdownMenuProps) => {
  const router = useRouter()
  const viewer = useViewerDetails(message.owner._id)
  const editMessage = useEditMessage()
  const removeMessage = useRemoveMessage()

  const handleRoleChange = (role: string) => {
    editMessage({ messageId: message._id, role, name: message.name, text: message.content })
      .then(() => {
        toast.success('Message role updated')
      })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred')
      })
  }

  const handleDeleteMessage = () => {
    removeMessage({ messageId: message._id })
      .then(() => {
        toast.success('Message deleted')
      })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred')
      })
  }

  if (!viewer.isOwner) return null
  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Content size="1" variant="soft">
        <DropdownMenu.Item onSelect={onEdit}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={() => router.push(`/thread/${message.threadSlug}/${message.series}`)}
        >
          Link
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Role</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup
              value={message.role}
              onValueChange={(value) => handleRoleChange(value)}
            >
              <DropdownMenu.RadioItem value="user">User</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="assistant">Assistant</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onSelect={handleDeleteMessage}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
