import { forwardRef } from 'react'
import NextImage from 'next/image'

const disableNextOptimization = !!process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED

type ImgProps = React.ComponentProps<typeof NextImage>

export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img({ ...props }, forwardedRef) {
  return <NextImage unoptimized={disableNextOptimization} {...props} ref={forwardedRef} />
})
