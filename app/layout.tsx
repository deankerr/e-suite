import { ClientProviders } from '@/app/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/app/components/util/TailwindBreakpointIndicator'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
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
        <ClientProviders>
          <JotaiProvider>
            <Theme className="h-full" accentColor="orange" appearance="dark">
              {children}
              <Toaster richColors />
              <TailwindBreakpointIndicator />
            </Theme>
          </JotaiProvider>
        </ClientProviders>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
