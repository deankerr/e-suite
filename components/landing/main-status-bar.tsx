import { cn } from '@/lib/utils'

export function MainStatusBar({ className }: {} & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-t-primary bg-background px-3 text-xs text-muted-foreground',
        className,
      )}
    >
      <div></div>
      <div className="font-mono"></div>
      <div></div>
    </div>
  )
}
