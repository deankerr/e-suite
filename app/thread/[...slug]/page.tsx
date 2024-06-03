import { SingleThreadPage } from '@/components/pages/SingleThreadPage'

export default function Page({ params }: { params: { slug: string[] } }) {
  const threadRing = params.slug[0]
  const messageRing = params.slug[1] ?? ''
  const fileRing = params.slug[2] ?? ''

  return threadRing ? (
    <SingleThreadPage threadIndex={[threadRing, messageRing, fileRing]} />
  ) : (
    <div>404</div>
  )
}
