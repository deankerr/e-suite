import { ImageCard } from '@/components/images/ImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { useLightbox } from '@/components/lightbox/hooks'

import type { EMessage, RunConfigTextToImage } from '@/convex/types'

export const Gallery = ({ message, priority }: { message: EMessage; priority?: boolean }) => {
  const openLightbox = useLightbox()
  const slides = message.images.map((image) => ({
    type: 'image' as const,
    src: `/i/${image.uid}`,
    width: image.width,
    height: image.height,
    blurDataURL: image.blurDataUrl,
  }))

  const placeholders = message.jobs
    .filter((job) => job.name === 'textToImage' && job.status !== 'failed')
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
      {message.images.map((image, index) => (
        <ImageCard
          key={image._id}
          className="max-w-xs cursor-pointer"
          image={image}
          imageProps={{
            sizes: '(max-width: 410px) 90vw, 20rem',
            priority,
            onClick: () => {
              openLightbox({
                slides,
                index,
              })
            },
          }}
        />
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
