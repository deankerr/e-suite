import { ChatsList } from '@/components/chat/ChatsList'
import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { thread_id: string } }) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=chat&id=${params.thread_id}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatsList />
      {children}
    </>
  )
}
