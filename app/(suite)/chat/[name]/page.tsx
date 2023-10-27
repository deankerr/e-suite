import { Chat } from '@/components/chat/chat'

export default function ChatPage({ params }: { params: { name: string } }) {
  return <Chat name={params.name} />
}
