/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Spinner } from '@/app/components/ui/Spinner'
import loaderBars from '@/assets/hola-loader-bars-sm.svg'
import { LoaderBars } from '@/components/ui/LoaderBars'
import type { ThreadMessage } from '@/convex/threads/do'
import { cn } from '@/lib/utils'
import { Text } from '@radix-ui/themes'
import NextImage from 'next/image'
import { forwardRef } from 'react'

type Props = {
  message: ThreadMessage
}

// https://source.boringavatars.com/beam/120/${nanoid(5)}?square

export const Message = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Message({ message, className, ...props }, forwardedRef) {
    const displayName = message.name ?? getDisplayRole(message.role)

    const bgColors = {
      user: 'bg-bronze-2',
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
        className={cn('space-y-0.5 px-4 py-1', bgColors[message.role], className)}
        ref={forwardedRef}
      >
        {/* role info */}
        <div className={cn('flex', roleColors[message.role])}>{displayName}</div>

        <div className="space-y-5 text-base">
          {message.job?.status === 'pending' && <LoaderBars className="absolute" />}
          {/* content body */}
          {message.content.split('\n').map((p, i) => (
            <Text key={i} as="p">
              {p}
            </Text>
          ))}
        </div>

        {/* job status */}
        <div className="absolute right-2.5 top-0.5 space-y-0.5 text-right font-code text-xs text-gold-5">
          {message.job ? message.job.status : null} {message._id.slice(-8)}
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
