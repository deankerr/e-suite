import { cn } from '@/lib/utils'

export const MessageInput = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('', className)}>
      MessageInput
    </div>
  )
}
