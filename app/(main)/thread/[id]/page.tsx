'use client'

import { ThreadShell } from '@/app/components/threads/ThreadShell'
import { Id } from '@/convex/_generated/dataModel'

export default function ThreadIdPage({ params }: { params: { id: Id<'threads'> } }) {
  // ThreadIdPage

  return <ThreadShell className="w-full" threadId={params.id} />
}
