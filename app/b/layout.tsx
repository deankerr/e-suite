import { Navigation } from '@/app/b/Navigation'
import { CommandShell } from '@/components/command-shell/CommandShell'
import { cn } from '@/lib/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `β / %s`,
    default: `β`,
  },
}

export default function Lo36Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh">
      <Navigation />
      <div className={cn('h-full w-full p-1.5 pl-0 sm:ml-56')}>{children}</div>
      <CommandShell />
    </div>
  )
}
