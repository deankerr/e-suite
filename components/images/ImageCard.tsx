import { forwardRef } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/shared/types'

type ImageCardProps = { image: EImage; sizes?: string } & React.ComponentPropsWithoutRef<'div'>

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ image, sizes, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ aspectRatio: image.width / image.height, width: image.width, maxWidth: '100%' }}
        {...props}
        className={cn('overflow-hidden rounded-xl', className)}
      >
        <Image
          src={`/i/${image._id}.webp`}
          width={image.width}
          height={image.height}
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={image.blurDataUrl}
          className={'h-full w-full object-cover'}
          sizes={sizes}
          alt="generated image"
        />
      </div>
    )
  },
)
ImageCard.displayName = 'ImageCard'
