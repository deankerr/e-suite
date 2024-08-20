import { ThreadHeader, ThreadPage } from '@/components/pages/thread/ThreadPage'
import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: { thread_id: string }
  modal: React.ReactNode
}) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=images&id=${params.thread_id}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
    description: data.description,
  }
}

export default function Layout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  params: { thread_id: string }
}) {
  return (
    <ThreadPage>
      <ThreadHeader thread_id={params.thread_id} />
      {children}
      {modal}
    </ThreadPage>
  )
}
