import { forwardRef } from 'react'
import NextImage from 'next/image'

const disableNextOptimization = !!process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED

type ImgProps = { optimizedSrc?: string } & React.ComponentProps<typeof NextImage>

export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img(
  { optimizedSrc, src, ...props },
  forwardedRef,
) {
  return (
    <NextImage
      unoptimized={disableNextOptimization || !!optimizedSrc}
      src={optimizedSrc ?? src}
      {...props}
      ref={forwardedRef}
    />
  )
})
