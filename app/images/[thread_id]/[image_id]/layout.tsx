import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: { thread_id: string; image_id: string }
}) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=image&id=${params.image_id}`)
  if (!response.ok) return {}

  const data = (await response.json()) as Partial<{ title: string; description: string }>
  return {
    title: data.title,
    description:
      data.description && data.description.length > 200
        ? data.description.slice(0, 200) + '...'
        : data.description,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
