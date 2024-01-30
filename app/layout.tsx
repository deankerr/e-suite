import { ClientProviders } from '@/app/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/app/components/util/TailwindBreakpointIndicator'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata } from 'next'
import { BIZ_UDMincho, DotGothic16 } from 'next/font/google'
import { Toaster } from 'sonner'
import { DebugPanel } from './components/DebugPanel'
import './globals.css'

export const metadata: Metadata = {
  title: 'e/suite',
  description: "it's the e/suite",
}

const dotGothic16 = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dot',
})

const bizUdMincho = BIZ_UDMincho({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-biz',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dotGothic16.variable} ${bizUdMincho.variable} overscroll-y-none`}
      suppressHydrationWarning
    >
      <body>
        <ClientProviders>
          <JotaiProvider>
            <Theme accentColor="orange" appearance="dark">
              {children}
              <Toaster richColors />
              <TailwindBreakpointIndicator />
              <DebugPanel />
              {/* <ThemePanel defaultOpen={false} /> */}
            </Theme>
          </JotaiProvider>
        </ClientProviders>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
