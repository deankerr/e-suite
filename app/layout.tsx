import { ThemeProvider } from '@/components/util/theme-provider'
import './globals.css'
import SessionProvider from '@/components/util/session-provider'
import { TailwindBreakpointIndicator } from '@/components/util/tailwind-breakpoint-indicator'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'e/suite',
  description: "it's the e/suite",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="en" className="h-full overflow-hidden overscroll-none" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
            <TailwindBreakpointIndicator />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
