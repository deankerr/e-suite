import { ThemeProvider } from '@/components/util/theme-provider'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { TailwindBreakpointIndicator } from '@/components/util/tailwind-breakpoint-indicator'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-hidden overscroll-none" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <TailwindBreakpointIndicator />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
