import Lightbox from 'yet-another-react-lightbox'

import { GoldSparkles } from '@/components/effects/GoldSparkles'

import 'yet-another-react-lightbox/styles.css'

import { useState } from 'react'

import { ImageCard } from '@/components/images/ImageCard'
import NextJsImage from '@/components/images/NextJsImage'
import { Id } from '@/convex/_generated/dataModel'
import { EMessage } from '@/convex/shared/types'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/shared/structures'

export const ImageGallery = ({ message }: { message: EMessage }) => {
  const [open, setOpen] = useState(false)

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const files = message.files

  const slides = files
    ?.filter(
      (file): file is { type: 'image'; image: EImage; id: Id<'images'> } => file.type === 'image',
    )
    .map((file) => ({
      src: `/i/${file.image._id}.webp`,
      width: file.image.width,
      height: file.image.height,
      blurDataURL: file.image.blurDataUrl,
    }))

  if (!(textToImage || files)) return null
  return (
    <div className="w-fit max-w-full rounded-lg">
      <div
        className={cn(
          'mx-auto flex justify-center py-1',
          files?.length !== 0 ? 'grid grid-cols-2 gap-2' : '',
        )}
      >
        {files?.map((file, i) => {
          if (file.type === 'image_url') {
            const width = textToImage?.width ?? 1024
            const height = textToImage?.height ?? 1024
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl"
                style={{ aspectRatio: width / height, width: width, maxWidth: '100%' }}
              >
                <GoldSparkles />
              </div>
            )
          }

          if (file.type === 'image') {
            return (
              <ImageCard
                key={file.id}
                image={file.image}
                sizes="(max-width: 56rem) 50vw, 28rem"
                className="cursor-pointer"
                onClick={() => setOpen(true)}
              />
            )
          }
        })}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        carousel={{
          padding: '10%',
        }}
        controller={{ closeOnBackdropClick: true }}
        render={{ slide: NextJsImage }}
      />
    </div>
  )
}
