import { Doc } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Badge } from '@radix-ui/themes'
import { DeleteIcon, PencilRulerIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { IconButton } from '../ui/IconButton'

type Props = {
  message: Doc<'messages'>
}

export const Message = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Message({ message, className, ...props }, forwardedRef) {
    const displayName = message.name ?? getDisplayRole(message.role)
    // const displayClassname = getDisplayClassname(message.role)
    const displayClassname = ''
    return (
      <div {...props} className={cn('flex gap-3 p-1', className)} ref={forwardedRef}>
        <div className={cn('sm:min-w-20', displayClassname)}>
          <Badge
            color={message.role === 'assistant' ? 'gray' : 'orange'}
            className="h-min w-full justify-center text-sm"
          >
            {displayName}
          </Badge>
        </div>
        <p className="">{message.content}</p>
        <div className="flex shrink-0 grow justify-end space-x-1 px-4">
          <IconButton className="size-7">
            <PencilRulerIcon />
          </IconButton>
          <IconButton color="red" className="size-7">
            <DeleteIcon />
          </IconButton>
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

const getDisplayClassname = (role: string) => {
  const displayRoles: Record<string, string> = {
    user: 'bg-surface-accent',
    assistant: 'bg-cyan-4A',
    system: 'text-cyan',
  }
  if (role in displayRoles) return displayRoles[role]
  return ''
}
