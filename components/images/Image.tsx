'use client'

import { forwardRef } from 'react'
import NextImage from 'next/image'

export const Image = forwardRef<HTMLImageElement, React.ComponentPropsWithoutRef<typeof NextImage>>(
  (props, ref) => {
    return <NextImage draggable={false} {...props} ref={ref} />
  },
)
Image.displayName = 'Image'
