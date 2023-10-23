'use client'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type Props = LinkProps & React.HTMLAttributes<HTMLAnchorElement>

export function TabLink({ className, ...props }: Props) {
  const segment = useSelectedLayoutSegment()
  const isActive = props.href === segment

  return (
    <Link
      {...props}
      className={cn(
        className,
        isActive ? 'border-primary bg-muted/70 text-foreground' : 'text-foreground/50',
      )}
    />
  )
}
