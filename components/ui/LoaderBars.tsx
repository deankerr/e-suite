import loaderBars from '@/assets/hola-loader-bars-sm4.svg'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'
import { forwardRef } from 'react'

type LoaderBarsProps = {} & Partial<React.ComponentProps<typeof NextImage>>

export const LoaderBars = forwardRef<HTMLImageElement, LoaderBarsProps>(function LoaderBars(
  { className, ...props },
  forwardedRef,
) {
  return (
    <NextImage
      ref={forwardedRef}
      src={loaderBars}
      alt="loading"
      {...props}
      className={cn('w-20', className)}
    />
  )
})
