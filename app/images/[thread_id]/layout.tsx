import { ImagesQueryProvider } from '@/app/images/ImagesQueryProvider'
import { ThreadHeader, ThreadPage } from '@/components/pages/thread/ThreadPage'
import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { thread_id: string } }) {
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
  params,
}: {
  children: React.ReactNode
  params: { thread_id: string }
}) {
  return (
    <ImagesQueryProvider thread_id={params.thread_id}>
      <ThreadPage>
        <ThreadHeader thread_id={params.thread_id} />
        {children}
      </ThreadPage>
    </ImagesQueryProvider>
  )
}
