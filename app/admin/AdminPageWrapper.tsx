import { cn } from '@/lib/utils'

export const AdminPageWrapper = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn('grow overflow-auto rounded-lg border border-grayA-3 p-2', className)}
    />
  )
}
