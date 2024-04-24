import { forwardRef } from 'react'
import { AspectRatio } from '@radix-ui/themes'

import { cn } from '@/lib/utils'
import { GoldSparklesEffect } from './canvas/GoldSparklesEffect'

type ImageThumbProps = {
  image: { width: number; height: number }
} & React.ComponentProps<'div'>

export const ImageGenerating = forwardRef<HTMLDivElement, ImageThumbProps>(function ImageThumb(
  { image, className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={cn(
        'max-w-full shrink-0 overflow-hidden rounded-lg border border-gold-6',
        className,
      )}
      style={{ width: image.width }}
      ref={forwardedRef}
    >
      <AspectRatio ratio={image.width / image.height}>
        <GoldSparklesEffect />
      </AspectRatio>
    </div>
  )
})
