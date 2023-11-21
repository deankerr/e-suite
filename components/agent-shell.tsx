import { cn } from '@/lib/utils'

export function AgentShell({ className, children }: React.ComponentProps<'div'>) {
  return <div className={cn('', className)}>{children}</div>
}
