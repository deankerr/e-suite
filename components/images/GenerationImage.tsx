import { forwardRef } from 'react'
import NextImage from 'next/image'

import { GoldSparklesEffect } from '../canvas/GoldSparklesEffect'

import type { Generation } from '@/convex/external'

type GenerationImageProps = {
  generation: Generation
  imageProps?: Partial<React.ComponentProps<typeof NextImage>>
  containerWidth?: number
  containerHeight?: number
}

export const GenerationImage = forwardRef<HTMLDivElement, GenerationImageProps>(
  function GenerationImage(
    { generation, imageProps, containerWidth, containerHeight },
    forwardedRef,
  ) {
    const { image } = generation
    const width = image?.width ?? generation.width
    const height = image?.height ?? generation.height

    const isGenerating = !image && generation.result?.type !== 'error'

    return (
      <div
        className="overflow-hidden rounded-lg border"
        style={{ aspectRatio: width / height, width: containerWidth, height: containerHeight }}
        ref={forwardedRef}
      >
        {image && (
          <NextImage
            unoptimized
            src={image.rid ? `/i/${image.rid}.webp` : `https://placehold.co/${width}x${height}`}
            width={width}
            height={height}
            placeholder={image.blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={image.blurDataUrl}
            className="h-full w-full object-cover"
            alt=""
            {...imageProps}
          />
        )}

        {isGenerating && (
          <>
            <div className="animate-shimmer h-full w-full rounded-lg bg-gradient-to-r from-gold-3 via-gray-1 to-gold-3 bg-[length:400%_100%]"></div>
            <GoldSparklesEffect />
          </>
        )}
      </div>
    )
  },
)
