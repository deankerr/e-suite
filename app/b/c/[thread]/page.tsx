import { ChatPage } from '@/app/b/c/[thread]/ChatPage'

export default function ThreadPage({ params }: { params: { thread: string } }) {
  return <ChatPage slug={params.thread} />
}
