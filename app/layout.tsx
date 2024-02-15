import { ClientProviders } from '@/app/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/app/components/util/TailwindBreakpointIndicator'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata } from 'next'
import { BIZ_UDMincho, DotGothic16, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'e/suite',
  description: "it's the e/suite",
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

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
      className={cn(`overscroll-none`, inter.variable, bizUdMincho.variable, dotGothic16.variable)}
      suppressHydrationWarning
    >
      <body>
        <ClientProviders>
          <JotaiProvider>
            <Theme accentColor="orange" appearance="dark">
              {children}
              <Toaster richColors />
              <TailwindBreakpointIndicator />
              {/* <DebugPanel /> */}
              {/* <ThemePanel defaultOpen={false} /> */}
            </Theme>
          </JotaiProvider>
        </ClientProviders>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
