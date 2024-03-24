import { Id } from '@/convex/_generated/dataModel'
import { Generate } from '../Generate'

export default function GeneratePage({ params }: { params: { slug?: [Id<'generations'>] } }) {
  const generationsId = params.slug ? params.slug[0] : undefined

  return <Generate generationId={generationsId} />
}
