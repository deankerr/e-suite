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
        loader={loader}
      />
    )
  },
)
Image.displayName = 'Image'

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL!
function loader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(baseUrl)

  // external/public image
  if (URL.canParse(src) || src.startsWith('/')) {
    url.searchParams.append('image', src)
  } else {
    // backend image
    url.pathname += src
  }

  url.searchParams.append('w', width.toString())
  url.searchParams.append('q', quality?.toString() || '75')

  return url.toString()
}
