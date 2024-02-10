'use client'

import { Doc, Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Badge, DropdownMenu } from '@radix-ui/themes'
import { CheckIcon, PenSquareIcon, XIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { IconButton } from '../ui/IconButton'
import { TextArea } from '../ui/TextArea'

type Props = {
  message: Doc<'messages'>
  onDelete: (id: Id<'messages'>) => void
  onEdit: (values: {
    id: Id<'messages'>
    role: 'system' | 'user' | 'assistant'
    content: string
  }) => void
}

export const Message = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Message({ message, onDelete, onEdit, className, ...props }, forwardedRef) {
    const [isEditing, setIsEditing] = useState(false)
    const [contentValue, setContentValue] = useState(message.content)

    const displayName = message.name ?? getDisplayRole(message.role)
    // const displayClassname = getDisplayClassname(message.role)

    return (
      <div {...props} className={cn('flex gap-3 p-1', className)} ref={forwardedRef}>
        <div className={cn('sm:min-w-20')}>
          <Badge
            color={message.role === 'assistant' ? 'gray' : 'orange'}
            className="h-min w-full justify-center text-sm"
          >
            {displayName}
          </Badge>
        </div>
        {isEditing ? (
          <TextArea value={contentValue} onChange={(e) => setContentValue(e.target.value)} />
        ) : (
          <p className="">{message.content}</p>
        )}

        <div className="flex shrink-0 grow justify-end space-x-1 px-4">
          {isEditing ? (
            <>
              <IconButton onClick={() => setIsEditing(false)}>
                <XIcon />
              </IconButton>
              <IconButton
                color="green"
                onClick={() => {
                  if (contentValue !== message.content) {
                    onEdit({ id: message._id, role: message.role, content: contentValue })
                  }
                  setIsEditing(false)
                }}
              >
                <CheckIcon />
              </IconButton>
            </>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton>
                  <PenSquareIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant="soft">
                <DropdownMenu.Item onSelect={() => setIsEditing(true)}>Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red" onSelect={() => onDelete(message._id)}>
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>
      </div>
    )
  },
)

const getDisplayRole = (role: string) => {
  const displayRoles: Record<string, string> = {
    user: 'User',
    assistant: 'AI',
    system: 'System',
  }
  if (role in displayRoles) return displayRoles[role]
  return role
}

// const getDisplayClassname = (role: string) => {
//   const displayRoles: Record<string, string> = {
//     user: 'bg-surface-accent',
//     assistant: 'bg-cyan-4A',
//     system: 'text-cyan',
//   }
//   if (role in displayRoles) return displayRoles[role]
//   return ''
// }