import { forwardRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import NextImage from 'next/image'

import { Ent } from '@/convex/types'
import { cn } from '@/lib/utils'
import { CanvasRevealEffect } from './CanvasRevealEffect'

type StaticImageProps = {
  image?: Partial<Ent<'images'>> | null
  alt: string
} & React.ComponentProps<'div'>

export const StaticImage = forwardRef<HTMLDivElement, StaticImageProps>(function StaticImage(
  { image, alt, className, ...props },
  forwardedRef,
) {
  if (!image) return null
  const { width, height, blurDataURL } = image
  const storageUrl = image.storageUrl
  return (
    <div {...props} className={cn('overflow-hidden', '', className)} ref={forwardedRef}>
      {storageUrl ? (
        <NextImage
          src={storageUrl}
          alt={alt}
          width={width}
          height={height}
          blurDataURL={blurDataURL}
          className={cn('rounded object-contain')}
        />
      ) : (
        <AnimatePresence>
          <CanvasRevealEffect
            animationSpeed={3}
            className={cn('bg-orange-3')}
            colors={[
              [255, 128, 31],
              [254, 137, 198],
            ]}
          />
        </AnimatePresence>
      )}
    </div>
  )
})
