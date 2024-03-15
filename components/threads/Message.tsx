'use client'

import { IconButton } from '@/app/components/ui/IconButton'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { Message as MessageType } from '@/convex/threads/threads'
import { cn } from '@/lib/utils'
import { Text } from '@radix-ui/themes'
import { MoreHorizontal } from 'lucide-react'
import { forwardRef } from 'react'
import { MessageMenu } from './MessageMenu'

type Props = {
  message: MessageType
}

// https://source.boringavatars.com/beam/120/${nanoid(5)}?square

export const Message = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Message({ message, className, ...props }, forwardedRef) {
    const displayName = message.name ?? getDisplayRole(message.role)

    const bgColors = {
      user: 'bg-bronze-2',
      assistant: 'bg-gray-1',
      system: 'bg-green-1',
      tool: 'bg-green-1',
    } as const

    const roleColors = {
      user: 'text-accent',
      assistant: 'text-gold',
      system: 'text-gray',
      tool: 'text-gray',
    } as const

    return (
      <div
        {...props}
        className={cn('space-y-0.5 py-1', bgColors[message.role], className)}
        ref={forwardedRef}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-1 px-3 pr-2',
            roleColors[message.role],
          )}
        >
          {/* role/username */}
          {displayName}

          {/* job status */}
          <div className="grow space-y-0.5 text-right font-code text-xs text-gold-5">
            vo: {message.voiceover?._id.slice(-4)}{' '}
            {message.voiceover?.job?.status.slice(0, 1) ?? 'n'} | {message._id.slice(-4)}{' '}
            {message.job?.status.slice(0, 1) ?? 'n'}
          </div>

          <MessageMenu messageId={message._id}>
            <IconButton lucideIcon={MoreHorizontal} size="1" variant="ghost" className="m-0 p-0" />
          </MessageMenu>
        </div>

        {/* content */}
        <div className="space-y-5 px-1 text-base sm:px-3">
          {message.job?.status === 'pending' && <LoaderBars className="absolute" />}
          {/* content body */}
          {message.content.split('\n').map((p, i) => (
            <Text key={i} as="p">
              {p}
            </Text>
          ))}
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
