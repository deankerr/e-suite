import { auth } from '@/auth'
import './globals.css'
import { Providers } from '@/components/util/providers'
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" className="h-full overflow-hidden overscroll-none" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <Providers session={session}>
          {children}
          <Toaster richColors />
          <TailwindBreakpointIndicator />
        </Providers>
        {process.env.NODE_ENV !== 'development' && <Analytics />}
      </body>
    </html>
  )
}
