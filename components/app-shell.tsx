import { cn } from '@/lib/utils'

export function AppShell({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid h-full grid-flow-col grid-cols-[auto_1fr]', className)}>
      {children}
    </div>
  )
}
