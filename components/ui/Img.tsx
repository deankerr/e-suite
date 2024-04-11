import { forwardRef } from 'react'
import NextImage from 'next/image'

import { cn } from '@/lib/utils'

const disableNextOptimization = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === 'true'

type ImgProps = {} & React.ComponentProps<typeof NextImage>

export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img(
  { className, ...props },
  forwardedRef,
) {
  return (
    <NextImage
      unoptimized={disableNextOptimization}
      {...props}
      ref={forwardedRef}
      className={cn('', className)}
    />
  )
})
