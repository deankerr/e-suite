import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import { ClientProviders } from '@/components/providers/ClientProviders'
import { TailwindBreakpointIndicator } from '@/components/util/TailwindBreakpointIndicator'
import { cn } from '@/lib/utils'

import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    template: 'e/suite / %s',
    default: 'e/suite',
  },
  description: "it's the e/suite",
}

export const viewport: Viewport = {
  themeColor: '#111110',
  colorScheme: 'dark',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('overscroll-none', inter.variable, jetBrainsMono.variable)}>
      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ClientProviders>
            <Theme accentColor="orange" appearance="dark" panelBackground="translucent">
              {children}
              <Toaster richColors />
              <TailwindBreakpointIndicator />
            </Theme>
          </ClientProviders>
        </ClerkProvider>
        {process.env.NODE_ENV !== 'development' && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  )
}
