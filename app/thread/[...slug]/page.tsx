import { SingleThreadPage } from '@/components/pages/SingleThreadPage'

export default function Page({ params }: { params: { slug: string[] } }) {
  const slug = params.slug[0]

  return slug ? <SingleThreadPage threadIndex={[slug]} /> : <div>404</div>
}
