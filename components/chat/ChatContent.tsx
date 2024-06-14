import { cn } from '@/lib/utils'

export const ChatContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn('flex grow flex-col items-center gap-1 overflow-hidden py-1 pb-2', className)}
    />
  )
}
