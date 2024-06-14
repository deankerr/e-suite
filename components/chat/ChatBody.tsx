import { cn } from '@/lib/utils'

export const ChatBody = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div {...props} className={cn('flex grow overflow-hidden', className)} />
}
