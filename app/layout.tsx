import './globals.css'
import { ClientProviders } from '@/app/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/app/components/util/TailwindBreakpointIndicator'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { BIZ_UDMincho, DotGothic16 } from 'next/font/google'
import { Toaster } from 'sonner'

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
      className={`${dotGothic16.variable} ${bizUdMincho.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ClientProviders>
          <Theme accentColor="orange" appearance="dark">
            {children}
            <Toaster richColors />
            <TailwindBreakpointIndicator />
            {/* <ThemePanel defaultOpen={false} /> */}
          </Theme>
        </ClientProviders>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
