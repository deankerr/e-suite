'use client'

import { useThread } from '@/components/threads/useThread'
import { TopBar } from '@/components/ui/TopBar'
import { Id } from '@/convex/_generated/dataModel'
import { useSelectedLayoutSegment } from 'next/navigation'
import { ChatSidebar } from './ChatSidebar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const slug = useSelectedLayoutSegment() as Id<'threads'> | null

  const threadHelpers = useThread({ threadId: slug ?? undefined })

  return (
    <div className="flex h-full grow flex-col overflow-hidden">
      <TopBar />
      <div className="flex grow overflow-hidden">
        {children}
        <ChatSidebar threadHelpers={threadHelpers} />
      </div>
    </div>
  )
}
