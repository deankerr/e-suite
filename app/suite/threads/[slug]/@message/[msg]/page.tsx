import { MessagePage } from '@/components/pages/MessagePage'

export default function Page({ params }: { params: { slug: string; msg: string } }) {
  const slug = params.slug ?? ''
  const msg = parseInt(params.msg ?? '0')

  return <MessagePage slug={slug} mNum={msg} />
}
