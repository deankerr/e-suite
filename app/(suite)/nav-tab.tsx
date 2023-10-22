'use client'

import { cn } from '@/lib/utils'
import { useSelectedLayoutSegment } from 'next/navigation'

type Props = {
  children: React.ReactNode
  route?: string
} & React.HTMLAttributes<HTMLDivElement>

export function NavTab({ children, route, className }: Props) {
  const segment = useSelectedLayoutSegment()
  const active = route === segment
  return (
    <div
      className={cn(
        'flex h-16 w-full flex-col hover:bg-muted hover:text-foreground sm:flex-row-reverse',
        active ? 'bg-muted/70 text-foreground' : 'text-foreground/50',
        className,
      )}
    >
      <div className="flex w-full grow flex-col items-center justify-center gap-1.5">
        {children}
      </div>
      <div className={cn('h-[3px] w-full sm:h-full sm:w-[3px]', active && 'bg-primary')} />
    </div>
  )
}
