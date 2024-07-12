'use client'

import { forwardRef } from 'react'
import NextImage from 'next/image'

import { cn } from '@/lib/utils'

export const Image = forwardRef<HTMLImageElement, React.ComponentPropsWithoutRef<typeof NextImage>>(
  ({ className, ...props }, ref) => {
    return (
      <NextImage
        draggable={false}
        {...props}
        ref={ref}
        className={cn('h-full w-full object-contain', className)}
      />
    )
  },
)
Image.displayName = 'Image'
