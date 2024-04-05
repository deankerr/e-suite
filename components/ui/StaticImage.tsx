import { forwardRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import NextImage from 'next/image'

import { Ent } from '@/convex/types'
import { cn } from '@/lib/utils'
import { CanvasRevealEffect } from './CanvasRevealEffect'

type StaticImageProps = {
  image: Ent<'images'>
  alt: string
} & React.ComponentProps<'div'>

export const StaticImage = forwardRef<HTMLDivElement, StaticImageProps>(function StaticImage(
  { image, alt, className, ...props },
  forwardedRef,
) {
  const { width, height, storageUrl, blurDataURL } = image

  return (
    <div
      {...props}
      style={{ width, height }}
      className={cn('overflow-hidden', 'flex rounded-6 border-4 border-gray-1A', className)}
      ref={forwardedRef}
    >
      {storageUrl ? (
        <NextImage src={storageUrl} alt={alt} fill blurDataURL={blurDataURL} className={cn('')} />
      ) : (
        <AnimatePresence>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName={cn('bg-orange-3')}
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
