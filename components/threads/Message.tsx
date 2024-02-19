/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Spinner } from '@/app/components/ui/Spinner'
import type { ThreadMessage } from '@/convex/threads/do'
import { cn } from '@/lib/utils'
import { Badge, Text } from '@radix-ui/themes'
import { forwardRef } from 'react'

type Props = {
  message: ThreadMessage
}

// https://source.boringavatars.com/beam/120/${nanoid(5)}?square

export const Message = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Message({ message, className, ...props }, forwardedRef) {
    const displayName = message.name ?? getDisplayRole(message.role)

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

    const roleColors = {
      user: 'text-accent',
      assistant: 'text-gold',
      system: 'text-gray',
    } as const

    return (
      <div
        {...props}
        className={cn('space-y-0.5 px-4 py-2', bgColors[message.role], className)}
        ref={forwardedRef}
      >
        {/* role info */}
        <div className={cn('flex', roleColors[message.role])}>
          {/* <Badge
            size="1"
            variant="soft"
            className="w-24 justify-center"
            color={badgeColors[message.role]}
          >
            {displayName}
          </Badge> */}
          {displayName}
        </div>

        <div className="text-base">
          {message.job?.status === 'pending' && <Spinner />}
          {/* content body */}
          <Text>{message.content}</Text>
        </div>

        {/* job status */}
        {message.job ? (
          <div className="absolute right-2.5 top-0.5 space-y-0.5 text-right font-code text-xs text-gold-5">
            {message.job.status}
          </div>
        ) : null}
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
