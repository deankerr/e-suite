'use client'

import { Spinner } from '@/app/components/ui/Spinner'
import type { Id } from '@/convex/_generated/dataModel'
import type { ThreadMessage } from '@/convex/threads/do'
import { cn } from '@/lib/utils'
import { Badge, Text } from '@radix-ui/themes'
import { forwardRef } from 'react'

type Props = {
  message: ThreadMessage
  onDelete: (id: Id<'messages'>) => void
  onEdit: (values: {
    id: Id<'messages'>
    role: 'system' | 'user' | 'assistant'
    content: string
  }) => void
}

// https://source.boringavatars.com/beam/120/${nanoid(5)}?square

export const Message = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Message({ message, className, ...props }, forwardedRef) {
    const displayName = message.name ?? getDisplayRole(message.role)
    // const displayClassname = getDisplayClassname(message.role)

    const badgeColors = {
      user: 'orange',
      assistant: 'gold',
      system: 'green',
    } as const

    const bgColors = {
      user: 'bg-gold-1',
      assistant: 'bg-gray-1',
      system: 'bg-green-1',
    } as const

    return (
      <div
        {...props}
        className={cn('flex items-center gap-4 py-4 pl-2 pr-4', bgColors[message.role], className)}
        ref={forwardedRef}
      >
        {/* role info */}
        <div className="flex min-w-28 shrink-0 flex-col justify-center">
          <Badge size="2" className="justify-center" color={badgeColors[message.role]}>
            {displayName}
          </Badge>
        </div>

        <div className="wd-[90ch] text-sm">
          {message.job?.status === 'pending' && <Spinner />}
          {/* content body */}
          <Text className="">{message.content}</Text>
        </div>

        {/* job status */}
        <div className="absolute right-2.5 top-0.5 space-y-0.5 text-right font-code text-xs text-gold-5">
          <div>
            {message.job?.status} {message.job?.type} {message.job?._id}
          </div>
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

// const getDisplayColor = (role: string) => {
//   const displayRoles: Record<string, string> = {
//     user: 'text-accent',
//     assistant: 'text-blue',
//     system: 'text-cyan',
//   }
//   if (role in displayRoles) return displayRoles[role]
//   return ''
// }

/* 
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
                  <PenSquareIcon className="size-5 stroke-1" />
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

*/
