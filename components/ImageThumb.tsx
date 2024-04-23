import { forwardRef } from 'react'
import { AspectRatio } from '@radix-ui/themes'
import NextImage from 'next/image'

import { cn, getImageUrl } from '@/lib/utils'

import type { Doc } from '@/convex/_generated/dataModel'

type ImageThumbProps = {
  image: Doc<'generated_images'>
  generation?: Doc<'generations'>
  loading?: 'eager' | 'lazy'
} & React.ComponentProps<'div'>

export const ImageThumb = forwardRef<HTMLDivElement, ImageThumbProps>(function ImageThumb(
  { image, loading = 'lazy', className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={cn(
        'max-w-full shrink-0 overflow-hidden rounded-lg border border-gold-7',
        className,
      )}
      ref={forwardedRef}
    >
      <AspectRatio ratio={image.width / image.height}>
        <NextImage
          unoptimized
          src={getImageUrl(image.slugId)}
          alt=""
          loading={loading}
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={image.blurDataUrl}
          width={image.width}
          height={image.height}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
})
