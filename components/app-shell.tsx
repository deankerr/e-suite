'use client'

import { Session } from '@/lib/server'
import { cn } from '@/lib/utils'
import { AppContent } from './app-content'
import { AppSidebar } from './app-sidebar'

export function AppShell({
  session,
  className,
  children,
}: { session: Session } & React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid h-full grid-flow-col grid-cols-[auto_1fr]', className)}>
      <AppSidebar className="bg-muted" session={session} />
      <AppContent session={session} />
    </div>
  )
}
