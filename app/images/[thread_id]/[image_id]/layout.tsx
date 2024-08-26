import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: { thread_id: string; image_id: string }
}) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=image&id=${params.image_id}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
    description: data.description,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
