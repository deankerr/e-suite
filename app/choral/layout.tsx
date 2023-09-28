import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'choral 💖',
  description: 'a chatroom that talks to you',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
