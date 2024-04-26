import NextImage from 'next/image'

import { getImageUrl } from '@/lib/utils'
import { GoldSparklesEffect } from '../canvas/GoldSparklesEffect'

type ImageFileProps = {
  rid?: string
  blurDataUrl?: string
  width: number
  height: number
} & Partial<React.ComponentProps<typeof NextImage>>

export const ImageFile = ({ rid, width, height, blurDataUrl, style, ...props }: ImageFileProps) => {
  if (rid?.startsWith('*generating*')) {
    return (
      <div
        className="overflow-hidden rounded-lg border"
        style={{ aspectRatio: width / height, ...style }}
      >
        <div className="animate-shimmer h-full w-full rounded-lg bg-gradient-to-r from-gold-3 via-gray-1 to-gold-3 bg-[length:400%_100%]"></div>
        <GoldSparklesEffect />
      </div>
    )
  }

  const src = rid ? getImageUrl(rid) : `https://placehold.co/${width}x${height}`

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ aspectRatio: width / height, ...style }}
    >
      <NextImage
        unoptimized
        src={src}
        width={width}
        height={height}
        placeholder={blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={blurDataUrl}
        className="h-full w-full object-cover"
        alt=""
        {...props}
      />
    </div>
  )
}
