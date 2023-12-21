import { cn } from '@/lib/utils'
import { Avatar } from '../ui/Avatar'

type ChatBubbleProps = {
  role?: string
} & React.ComponentProps<'div'>

export const ChatBubble = ({ children, role, className, ...props }: ChatBubbleProps) => {
  return (
    <div className="flex gap-6">
      <Avatar className="m-0.5 shrink-0" />
      <div
        {...props}
        className={cn(
          'prose prose-stone grow rounded-lg bg-n-300 p-5 dark:prose-invert dark:bg-n-950',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
