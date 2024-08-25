import { Thread } from '@/components/threads/Thread'
import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { image_id: string } }) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=image&id=${params.image_id}`)
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
  params: { image_id: string }
}) {
  return <Thread thread_id={params.image_id}>{children}</Thread>
}
