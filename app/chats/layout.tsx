import { ChatsNavPanel } from '@/components/chat/ChatsNavPanel'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatsNavPanel />
      {children}
    </>
  )
}
