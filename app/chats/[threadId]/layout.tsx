import { getConvexSiteUrl } from '@/app/lib/utils'

export async function generateMetadata(props: { params: Promise<{ threadId: string }> }) {
  const params = await props.params;
  const response = await fetch(`${getConvexSiteUrl()}/metadata?route=chats&id=${params.threadId}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
