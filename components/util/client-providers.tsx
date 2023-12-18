'use client'

import { Flowbite } from 'flowbite-react'
import { ThemeProvider } from 'next-themes'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Flowbite>{children}</Flowbite>
}
