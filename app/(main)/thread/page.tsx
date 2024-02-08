import { ThreadShell } from '@/app/components/threads/ThreadShell'
import { ScrollArea } from '@radix-ui/themes'

export default function ThreadPage() {
  // ThreadPage

  return (
    <div className="grid overflow-hidden">
      <ScrollArea>
        <ThreadShell className="w-full" setTitle="New Chat" />
      </ScrollArea>
    </div>
  )
}
