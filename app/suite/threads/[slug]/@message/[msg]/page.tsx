import { MessageDetailPage } from '@/app/suite/threads/[slug]/@message/[msg]/MessageDetailPage'

export default function Page({ params: { slug, msg } }: { params: { slug: string; msg: string } }) {
  if (!(slug && msg)) return null
  const mNum = parseInt(msg)
  return <MessageDetailPage slug={slug} mNum={mNum} />
}
