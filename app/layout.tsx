import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { OpenPanelComponent } from '@openpanel/nextjs'
import { Theme, ThemePanel } from '@radix-ui/themes'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import { AppLayout } from '@/app/AppLayout'
import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { ClientProviders } from '@/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/components/util/TailwindBreakpointIndicator'
import { appConfig } from '@/config/config'
import { cn, environment } from '@/lib/utils'

import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · %s`,
    default: `${appConfig.siteTitle}`,
  },
  description: appConfig.siteDescription,
}

export const viewport: Viewport = {
  themeColor: '#090909',
  colorScheme: 'dark',
}

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('overscroll-none', sans.variable, mono.variable)}>
      {process.env.METICULOUS === 'true' && (
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
            data-project-id="nbXksKI7xQWFFu6T8ARpgvCnWU91V2zWxIWYOqaZ"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        </head>
      )}

      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ClientProviders>
            <Theme accentColor="orange" grayColor="slate" appearance="dark" panelBackground="solid">
              <AppLayout>{children}</AppLayout>
              <Toaster position="top-right" theme="light" richColors />
              <LightboxProvider />
              {environment === 'dev' && <ThemePanel defaultOpen={false} />}
            </Theme>
          </ClientProviders>
        </ClerkProvider>
        {environment === 'prod' && (
          <>
            <SpeedInsights />
            <OpenPanelComponent
              clientId="6f2e9c18-cc3c-49d1-a2ac-9e482c2e4a66"
              trackScreenViews={true}
              trackAttributes={true}
              trackOutgoingLinks={true}
            />
          </>
        )}
        <TailwindBreakpointIndicator />
      </body>
    </html>
  )
}
