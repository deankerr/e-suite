import { Navigation } from '@/app/b/Navigation'
import { CommandShell } from '@/components/command-shell/CommandShell'
import { CreateThreadShell } from '@/components/command-shell/pages/CreateThread'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `β / %s`,
    default: `β`,
  },
}

export default function Lo36Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-svh">
        <Navigation className="pr-0" />
        {children}
      </div>
      <CommandShell />
      <CreateThreadShell />
    </>
  )
}
