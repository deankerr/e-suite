import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md border-grayA-3 bg-grayA-2', className)}
      aria-hidden
      tabIndex={-1}
      {...props}
    />
  )
}
