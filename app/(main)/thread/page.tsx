import { ThreadShell } from '@/app/components/threads/ThreadShell'

export default function ThreadPage() {
  // ThreadPage

  return (
    <div className="grid overflow-hidden">
      <ThreadShell className="w-full" setTitle="New Chat" />
    </div>
  )
}
