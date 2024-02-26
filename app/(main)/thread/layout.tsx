import { ThreadsList } from '@/components/threads/ThreadsList'

export default function ThreadLayout({ children }: { children: React.ReactNode }) {
  // ThreadLayout

  return (
    <>
      <ThreadsList />
      {children}
    </>
  )
}
