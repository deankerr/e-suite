import './globals.css'
import { ClientProviders } from '@/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/components/util/TailwindBreakpointIndicator'
import { Theme, ThemePanel } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'e/suite',
  description: "it's the e/suite",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>
          <Theme accentColor="orange" appearance="dark">
            {children}
            <Toaster richColors />
            <TailwindBreakpointIndicator />
            <ThemePanel defaultOpen={false} />
          </Theme>
        </ClientProviders>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
