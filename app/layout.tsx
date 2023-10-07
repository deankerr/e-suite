import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavLayout } from './NavLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'pabel 💖',
  description: 'Generated by create next app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-base-300">
      <body className={`${inter.className}`}>
        <NavLayout>{children}</NavLayout>
      </body>
    </html>
  )
}
