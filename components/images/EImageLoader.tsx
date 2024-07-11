'use client'

import { forwardRef } from 'react'
import NextImage from 'next/image'

import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const EImageLoader = forwardRef<
  HTMLImageElement,
  { image: EImage } & Partial<React.ComponentPropsWithoutRef<typeof NextImage>>
>(({ image, className, ...props }, ref) => {
  const src = `/i/${image._id}.webp`

  return (
    <NextImage
      {...props}
      ref={ref}
      src={src}
      alt={props.alt ?? ''}
      placeholder={image.blurDataUrl ? 'blur' : 'empty'}
      blurDataURL={image.blurDataUrl}
      width={image.width}
      height={image.height}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={cn('rounded-lg object-contain', className)}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
})

EImageLoader.displayName = 'EImageLoader'
