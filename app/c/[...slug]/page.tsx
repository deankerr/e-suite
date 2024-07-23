import { ChatPage } from '@/components/pages/ChatPage'

export default function ThreadPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug[0] ?? ''
  const series = params.slug[1] ?? ''
  return <ChatPage slug={slug} series={series} />
}
