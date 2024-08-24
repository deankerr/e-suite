import { ms } from 'itty-time'
import Link from 'next/link'

import { IImageCard } from '@/components/images/IImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'

import type { EMessage, RunConfigTextToImage } from '@/convex/types'

export const Gallery = ({ message, priority }: { message: EMessage; priority?: boolean }) => {
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
    <div className="flex grow flex-wrap justify-center gap-2 py-1">
      {message.images.map((image) => (
        <Link href={`/image/${image.id}`} key={image._id}>
          <IImageCard image={image} sizes="(max-width: 410px) 90vw, 20rem" priority={priority} />
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
