import { cn } from '@/lib/utils'
import { Session } from 'next-auth'

export function MainStatusBar({
  session,
  className,
}: { session: Session } & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-t-primary bg-background px-3 text-xs text-muted-foreground',
        className,
      )}
    >
      <div></div>
      <div className="font-mono">{session && `${session?.user.role}.${session?.user.id}`}</div>
      <div></div>
    </div>
  )
}
