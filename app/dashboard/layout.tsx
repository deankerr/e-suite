'use client'

import { useLoadViewerThreads } from '@/lib/api'

export default function Layout({ children }: { children: React.ReactNode }) {
  useLoadViewerThreads()
  return children
}
