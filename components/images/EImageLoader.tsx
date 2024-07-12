'use client'

import { forwardRef } from 'react'
import NextImage from 'next/image'

import { cn, getConvexSiteUrl } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const EImageLoader = forwardRef<
  HTMLImageElement,
  { image: EImage } & Partial<React.ComponentPropsWithoutRef<typeof NextImage>>
>(({ image, className, ...props }, ref) => {
  const src = `/i/${image._id}`
  // const src = getConvexSiteUrl().concat(`/i/${image._id}.webp`)
  return (
    <NextImage
      {...props}
      ref={ref}
      src={src}
      alt={src ?? props.alt ?? ''}
      placeholder={image.blurDataUrl ? 'blur' : 'empty'}
      blurDataURL={image.blurDataUrl}
      width={image.width}
      height={image.height}
      className={cn('rounded-lg object-contain', className)}
      style={{
        width: '100%',
        height: '100%',
      }}
      draggable={false}
      // loader={cfWorkerLoader}
    />
  )
})

EImageLoader.displayName = 'EImageLoader'

// Docs: https://developers.cloudflare.com/images/url-format
export function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
  // return `https://e.dean.taxi/cdn-cgi/image/${params.join(',')}/${src}`
  return `https://jolly-cell-ac55.dean-kerr.workers.dev/${params.join(',')}/${src}`
}

function cfWorkerLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // const url = new URL(`https://falling-queen-ebcf.dean-kerr.workers.dev`)
  const url = new URL(`https://e.dean.taxi/cfi/`)
  url.searchParams.append('width', width.toString())
  url.searchParams.append('quality', quality?.toString() || '75')
  url.searchParams.append('format', 'auto')
  url.searchParams.append('image', src)
  return url.toString()
}

/* 
https://imagedelivery.net/962OoC94lPm2zPpv73-RBw/
*/
