import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

import { EImageLite } from '@/components/images/EImageLite'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { EMessage } from '@/convex/types'
import { cn } from '@/lib/utils'

const Lightbox = dynamic(() => import('@/components/images/Lightbox'))

const devShowLoaders = false

export const ImageGallery = ({ message }: { message: EMessage }) => {
  const [open, setOpen] = useState(false)
  const [initialSlideIndex, setInitialSlideIndex] = useState(0)

  const textToImageConfig = message.inference?.type === 'text-to-image' ? message.inference : null
  const images = useMemo(() => message.images, [message.images])
  const nShowImagesGenerating = Math.max(0, (textToImageConfig?.n ?? 0) - images.length)

  const frames = Array.from({ length: images.length + nShowImagesGenerating }, (_, i) => {
    const image = images[i]
    if (image && !devShowLoaders) return { ...image, type: 'image' as const }
    return {
      width: textToImageConfig?.width ?? 1024,
      height: textToImageConfig?.height ?? 1024,
      type: 'placeholder' as const,
    }
  })

  const hasJobErrors = message.jobs.some((job) => job.status === 'failed')

  // NOTE uses custom next/image
  const slides = useMemo(
    () =>
      images.map((image) => ({
        src: `/i/${image._id}`,
        width: image.width ?? 1024,
        height: image.height ?? 1024,
        blurDataURL: image.blurDataUrl ?? '',
      })),
    [images],
  )

  if (frames.length === 0) return null
  return (
    <div className="w-fit max-w-full rounded-lg">
      <div className={cn('mx-auto flex justify-center py-1', 'grid grid-cols-2 gap-2')}>
        {frames.map((frame, i) => {
          if (frame.type === 'placeholder') {
            if (hasJobErrors) return null
            return (
              <ImageGeneratingEffect
                key={i}
                style={{
                  aspectRatio: frame.width / frame.height,
                  width: frame.width,
                  maxWidth: '100%',
                }}
              />
            )
          }

          return (
            <EImageLite
              key={frame._id}
              image={frame}
              sizes="(max-width: 56rem) 50vw, 28rem"
              className="w-80 max-w-full cursor-pointer"
              onClick={() => {
                setOpen(true)
                setInitialSlideIndex(i)
              }}
            />
          )
        })}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={initialSlideIndex}
        controller={{ closeOnBackdropClick: true }}
        carousel={{
          padding: '32px',
        }}
      />
    </div>
  )
}
