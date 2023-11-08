import { cn } from '@/lib/utils'

export function AgentTabBar({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('overflow-x-auto border-b', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          true && 'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
      >
        Message
      </div>
      <div
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          false && 'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
      >
        Parameters
      </div>
      <div
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          true && 'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
      >
        Details
      </div>
    </div>
  )
}
