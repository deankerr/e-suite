import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { Provider as JotaiProvider } from 'jotai'
import { Inter, JetBrains_Mono } from 'next/font/google'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(`overscroll-none`, inter.variable, jetBrainsMono.variable)}
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
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
