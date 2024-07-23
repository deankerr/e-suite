import { ModelsApiProvider } from '@/app/b/_providers/ModelsApiProvider'
import { Navigation } from '@/app/b/Navigation'

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
      <div className="flex h-svh md:p-1.5">
        <Navigation />
        {children}
      </div>
    </ModelsApiProvider>
  )
}
