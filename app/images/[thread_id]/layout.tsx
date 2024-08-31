import { ImagesQueryProvider } from '@/app/images/ImagesQueryProvider'
import { Thread } from '@/components/threads/Thread'
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
    <ImagesQueryProvider>
      <Thread thread_id={params.thread_id}>
        {children}
        {modal}
      </Thread>
    </ImagesQueryProvider>
  )
}
