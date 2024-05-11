'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

import { useMessageToAtom } from '@/lib/api'

export default function Layout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const [rid] = segments
  useMessageToAtom(rid)

  return children
}
