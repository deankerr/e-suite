import { ChatToolbar } from '@/components/threads/ChatToolbar'
import { Thread } from '@/components/threads/Thread'
import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { thread_id: string } }) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=chat&id=${params.thread_id}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
  }
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { thread_id: string }
}) {
  return (
    <Thread thread_id={params.thread_id}>
      <ChatToolbar thread_id={params.thread_id} />
      {children}
    </Thread>
  )
}
