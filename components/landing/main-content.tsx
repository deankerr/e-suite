import { cn } from '@/lib/utils'

export function MainContent({
  className,
  children,
}: { children: React.ReactNode } & React.ComponentProps<'div'>) {
  return <main className={cn('overflow-x-hidden p-6', className)}>{children}</main>
}
