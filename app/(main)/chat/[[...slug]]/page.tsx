import { TopBar } from '@/components/ui/TopBar'
import { Id } from '@/convex/_generated/dataModel'
import { Chat } from './Chat'

export default async function ChatPage({ params }: { params: { slug?: [Id<'threads'>] } }) {
  const threadId = params.slug ? params.slug[0] : undefined

  return (
    <div className="flex h-full grow flex-col overflow-hidden">
      <TopBar />
      <Chat threadId={threadId} />
    </div>
  )
}
