import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Provider as JotaiProvider } from 'jotai'
import { Inter, JetBrains_Mono, Manrope, Merriweather } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'

import { AppStoreProvider } from '@/components/providers/AppStoreProvider'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { TailwindBreakpointIndicator } from '@/components/util/TailwindBreakpointIndicator'
import { cn } from '@/lib/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'e/suite',
  description: "it's the e/suite",
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

const merriweather = Merriweather({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-merriweather',
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

const fantasqueSansMono = localFont({
  src: '../assets/fonts/FantasqueSansMono-Regular.woff2',
  display: 'swap',
  variable: '--font-fantasque-sans-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        `overscroll-none`,
        inter.variable,
        jetBrainsMono.variable,
        merriweather.variable,
        manrope.variable,
        fantasqueSansMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="h-full">
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ClientProviders>
            <JotaiProvider>
              <Theme className="h-full" accentColor="orange" appearance="dark">
                <AppStoreProvider>
                  {children}
                  <Toaster richColors />
                  <TailwindBreakpointIndicator />
                </AppStoreProvider>
              </Theme>
            </JotaiProvider>
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
