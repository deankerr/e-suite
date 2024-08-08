import { ImageCard } from '@/components/images/ImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { useLightbox } from '@/components/lightbox/hooks'
import { extractJobsDetails, extractRunConfig } from '@/convex/shared/helpers'

import type { EMessage } from '@/convex/types'

export const Gallery = ({ message, priority }: { message: EMessage; priority?: boolean }) => {
  const openLightbox = useLightbox()
  const slides = message.images.map((image) => ({
    type: 'image' as const,
    src: `/i/${image.uid}`,
    width: image.width,
    height: image.height,
    blurDataURL: image.blurDataUrl,
  }))

  const jobs = extractJobsDetails(message.jobs)
  const hasFailedJobs = jobs.failed.length > 0

  const { textToImageConfig } = extractRunConfig(message.jobs)
  const numExpectedImages = hasFailedJobs ? 0 : (textToImageConfig?.n ?? 0)
  const numImagePlaceholders = Math.max(0, numExpectedImages - message.images.length)

  if (message.images.length === 0 && numImagePlaceholders === 0) return null
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

      {textToImageConfig &&
        [...Array(numImagePlaceholders)].map((_, i) => (
          <div key={i} className="w-full max-w-xs">
            <ImageGeneratingEffect
              style={{
                aspectRatio: (textToImageConfig.width ?? 512) / (textToImageConfig.height ?? 512),
                width: textToImageConfig.width ?? 512,
                maxWidth: '100%',
              }}
            />
          </div>
        ))}
    </div>
  )
}
