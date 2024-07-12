import { ChatPage } from '@/app/dev/lo36/c/[thread]/ChatPage'

export default function ThreadPage({ params }: { params: { thread: string } }) {
  return <ChatPage slug={params.thread} />
}
