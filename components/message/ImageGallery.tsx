import { useState } from 'react'
import dynamic from 'next/dynamic'

import { ImageCard } from '@/components/images/ImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { Pre } from '@/components/util/Pre'
import { Id } from '@/convex/_generated/dataModel'
import { EMessage } from '@/convex/shared/types'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/shared/structures'

const Lightbox = dynamic(() => import('@/components/images/Lightbox'))

const showLoader = false

export const ImageGallery = ({ message }: { message: EMessage }) => {
  const [open, setOpen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const files = message.files?.filter((file) => file.type !== 'sound_effect')
  const imageFiles =
    message.files?.filter((file) => file.type === 'image' || file.type === 'image_url') ?? []
  if (!(textToImage || imageFiles.length)) return null

  const width = textToImage?.width ?? 1024
  const height = textToImage?.height ?? 1024
  const n = Math.max(textToImage?.n ?? 1, files?.length ?? 0)

  const imageFrames = Array.from({ length: n }, (_, i) => {
    const file = files?.[i]
    if (file?.type === 'image') {
      return file
    }

    return { width, height, type: 'placeholder' as const }
  })

  const hasJobErrors = message.jobs.some((job) => job.status === 'failed')

  const definitelyImageFiles = imageFiles.filter((file) => file.type === 'image')
  const slides = definitelyImageFiles.map((file) => ({
    src: `/i/${file?.image?._id}.webp`,
    width: file?.image?.width ?? 1024,
    height: file?.image?.height ?? 1024,
    blurDataURL: file?.image?.blurDataUrl ?? '',
  }))

  return (
    <div className="w-fit max-w-full rounded-lg">
      <div
        className={cn(
          'mx-auto flex justify-center py-1',
          files?.length !== 0 ? 'grid grid-cols-2 gap-2' : '',
        )}
      >
        <Pre json={JSON.stringify(imageFrames, null, 2)} />
        {imageFrames.map((frame, i) =>
          !showLoader && frame.type === 'image' ? (
            <ImageCard
              key={frame.image._id}
              image={frame.image}
              sizes="(max-width: 56rem) 50vw, 28rem"
              className="cursor-pointer"
              onClick={() => {
                setOpen(true)
                setSlideIndex(i)
              }}
            />
          ) : !hasJobErrors ? (
            <ImageGeneratingEffect
              key={i}
              style={{ aspectRatio: width / height, width: width, maxWidth: '100%' }}
            />
          ) : null,
        )}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={slideIndex}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  )
}
