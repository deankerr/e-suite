import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import dynamic from 'next/dynamic'

import { Image } from '@/components/images/Image'
import { ImageCard } from '@/components/images/ImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { EMessage } from '@/convex/types'
import { cn } from '@/lib/utils'

const Lightbox = dynamic(() => import('@/components/images/Lightbox'))

const devShowLoaders = false

export const ImageGallery = ({ message }: { message: EMessage }) => {
  const [open, setOpen] = useState(false)
  const [initialSlideIndex, setInitialSlideIndex] = useState(0)

  const textToImageConfig = message.inference?.type === 'text-to-image' ? message.inference : null
  const imageFiles = useMemo(
    () => message.files?.filter((file) => file.type === 'image') ?? [],
    [message.files],
  )
  const nShowImagesGenerating = Math.max(0, (textToImageConfig?.n ?? 0) - imageFiles.length)

  const frames = Array.from({ length: imageFiles.length + nShowImagesGenerating }, (_, i) => {
    const file = imageFiles[i]
    if (file && !devShowLoaders) return file
    return {
      width: textToImageConfig?.width ?? 1024,
      height: textToImageConfig?.height ?? 1024,
      type: 'placeholder' as const,
    }
  })

  const hasJobErrors = message.jobs.some((job) => job.status === 'failed')

  const slides = useMemo(
    () =>
      imageFiles.map((file) => ({
        src: `/i/${file?.image?._id}.webp`,
        width: file?.image?.width ?? 1024,
        height: file?.image?.height ?? 1024,
        blurDataURL: file?.image?.blurDataUrl ?? '',
      })),
    [imageFiles],
  )

  if (frames.length === 0) return null
  return (
    <div className="w-fit max-w-full rounded-lg">
      <div
        className={cn(
          'mx-auto flex justify-center py-1',
          frames.length > 1 ? 'grid grid-cols-2 gap-2' : '',
        )}
      >
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

          if (frame.image === null || typeof frame.image.deletionTime !== 'undefined') {
            return (
              <div key={i}>
                <Icons.FileX className="size-6 text-red-11" />
              </div>
            )
          }

          return (
            <Image
              key={frame.image._id}
              alt=""
              image={frame.image}
              sizes="(max-width: 56rem) 50vw, 28rem"
              className="cursor-pointer"
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
