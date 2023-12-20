import PrelineScript from '@/components/util/PrelineScript'
import './globals.css'
import { ClientProviders } from '@/components/util/client-providers'
import { TailwindBreakpointIndicator } from '@/components/util/tailwind-breakpoint-indicator'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'e/suite',
  description: "it's the e/suite",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <ClientProviders>
          {children}
          <Toaster richColors />
          <TailwindBreakpointIndicator />
          <PrelineScript />
        </ClientProviders>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
