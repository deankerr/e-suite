import { ThreadShell } from '@/app/components/threads/ThreadShell'
import { Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@radix-ui/themes'

export default function ThreadIdPage({ params }: { params: { id: Id<'threads'> } }) {
  // ThreadIdPage

  return (
    <div className="grid overflow-hidden">
      <ScrollArea>
        <ThreadShell className="w-full" threadId={params.id} />
      </ScrollArea>
    </div>
  )
}
