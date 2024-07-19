import { ModelsApiProvider } from '@/app/b/_providers/ModelsApiProvider'
import { Navigation } from '@/app/b/Navigation'
import { Shell } from '@/components/command-shell/Shell'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `β / %s`,
    default: `β`,
  },
}

export default function Lo36Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModelsApiProvider>
      <div className="flex h-svh">
        <Navigation className="pr-0" />
        {children}
      </div>

      <Shell />
    </ModelsApiProvider>
  )
}
