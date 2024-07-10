'use client'

import { forwardRef } from 'react'
import NextImage from 'next/image'

import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

// const imageLoader = ({ src, width }: { src: string; width: number; quality?: number }) => {
//   return `/i/${src}.webp?w=${width}`
// }

export const EImageLoader = forwardRef<
  HTMLImageElement,
  { image: EImage } & Partial<React.ComponentPropsWithoutRef<typeof NextImage>>
>(({ image, className, ...props }, ref) => {
  const src = `/i/${image._id}.webp`

  return (
    <NextImage
      {...props}
      ref={ref}
      // loader={imageLoader}
      src={src}
      alt={props.alt ?? ''}
      placeholder={image.blurDataUrl ? 'blur' : 'empty'}
      blurDataURL={image.blurDataUrl}
      width={image.width}
      height={image.height}
      className={cn('rounded-lg', className)}
    />
  )
})

EImageLoader.displayName = 'EImageLoader'
