'use client'

import { forwardRef } from 'react'
import NextImage from 'next/image'

import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

type Props = { image: EImage } & Partial<React.ComponentPropsWithoutRef<typeof NextImage>>

export const IImage = forwardRef<HTMLImageElement, Props>(({ image, className, ...props }, ref) => {
  return (
    <NextImage
      alt=""
      src={`/i/${image.uid}`}
      placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
      blurDataURL={image?.blurDataUrl}
      width={image.width}
      height={image.height}
      className={cn('h-full w-full object-contain', className)}
      {...props}
      ref={ref}
    />
  )
})
IImage.displayName = 'IImage'
