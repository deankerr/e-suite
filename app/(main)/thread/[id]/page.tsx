import { ThreadShell } from '@/app/components/threads/ThreadShell'
import { Id } from '@/convex/_generated/dataModel'

export default function ThreadIdPage({ params }: { params: { id: Id<'threads'> } }) {
  // ThreadIdPage

  return (
    <div className="grid overflow-hidden">
      <ThreadShell className="w-full border-none" threadId={params.id} />
    </div>
  )
}
