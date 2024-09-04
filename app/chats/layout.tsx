import { ChatsList } from '@/components/chat/ChatsList'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatsList />
      {children}
    </>
  )
}
