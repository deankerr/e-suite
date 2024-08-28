import { ms } from 'itty-time'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { IImageCard } from '@/components/images/IImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'

import type { EMessage, RunConfigTextToImage } from '@/convex/types'

export const Gallery = ({ message, priority }: { message: EMessage; priority?: boolean }) => {
  const params = useParams()
  const slug = params.thread_id as string

  const placeholders = message.jobs
    .filter(
      (job) =>
        job.name === 'textToImage' &&
        job.status !== 'failed' &&
        Date.now() - job._creationTime < ms('1 minute'),
    )
    .flatMap((job) => {
      const input = job.input as RunConfigTextToImage
      return [...Array(input.n ?? 1)].map((_, i) => ({
        id: `${job._id}-${i}`,
        width: input.width ?? 512,
        height: input.height ?? 512,
      }))
    })
    .slice(message.images.length)

  if (message.images.length === 0 && placeholders.length === 0) return null
  return (
    <div className="flex grow flex-wrap gap-2 py-1">
      {message.images.map((image) => (
        <Link href={`/images/${slug}/${image.id}`} key={image._id}>
          <IImageCard
            image={image}
            sizes="(max-width: 410px) 20rem"
            priority={priority}
            className="h-72 w-auto [&>img]:object-cover"
          />
        </Link>
      ))}

      {placeholders.map((placeholder) => (
        <div key={placeholder.id} className="w-full max-w-xs">
          <ImageGeneratingEffect
            style={{
              aspectRatio: placeholder.width / placeholder.height,
              width: placeholder.width,
              maxWidth: '100%',
            }}
          />
        </div>
      ))}
    </div>
  )
}
