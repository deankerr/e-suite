'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export function ChatNav({ prop }: { prop?: any }) {
  const segment = useSelectedLayoutSegment()
  return <nav className="bg-muted">Tabs ere {segment}</nav>
}
