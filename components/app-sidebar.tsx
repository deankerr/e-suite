import { cn } from '@/lib/utils'

export function AppSidebar({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex w-60 shrink-0 flex-col items-center gap-4 bg-muted py-4', className)}>
      {children}
    </div>
  )
}
