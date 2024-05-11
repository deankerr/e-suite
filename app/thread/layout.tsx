'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

import { useLoadThread } from '@/lib/api'

export default function Layout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const [rid] = segments
  useLoadThread(rid)
  return children
}
