import { cn } from '@/lib/utils'

export function SuiteStatusBar({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-t-primary bg-background px-3 text-xs text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}
