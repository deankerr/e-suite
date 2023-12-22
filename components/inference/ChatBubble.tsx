import type { Role } from '@/data/schemas'
import { cn } from '@/lib/utils'
import { Avatar } from '../ui/Avatar'

const bubbleVariant: Record<string, string> = {
  default: 'bg-n-200 dark:bg-n-900',
  user: 'bg-n-200 dark:bg-n-900',
}

type ChatBubbleProps = {
  role?: Role
} & React.ComponentProps<'div'>

export const ChatBubble = ({ children, role = 'system', className, ...props }: ChatBubbleProps) => {
  const variant = bubbleVariant[role] ?? bubbleVariant.default
  return (
    <div className="flex gap-6">
      <Avatar className="m-0.5 shrink-0" />
      <div
        {...props}
        className={cn('prose prose-zinc grow rounded-lg p-5 dark:prose-invert', variant, className)}
      >
        {children}
      </div>
    </div>
  )
}
