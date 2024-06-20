import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Theme } from '@radix-ui/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { IBM_Plex_Mono, Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { PartyBoy } from '@/components/effects/PartyBoy'
import { ClientProviders } from '@/components/util/ClientProviders'
import { HighlightLoader } from '@/components/util/HighlightLoader'
import { cn, environment } from '@/lib/utils'

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

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-ibm-plex-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, ibmPlexMono.variable)}>
      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ClientProviders>
            <Theme accentColor="orange" appearance="dark" panelBackground="solid">
              {children}
              <PartyBoy />
              <Toaster position="top-right" theme="light" closeButton richColors />
              <HighlightLoader />
            </Theme>
          </ClientProviders>
        </ClerkProvider>
        {environment === 'prod' && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  )
}
