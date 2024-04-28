'use client'

import { forwardRef } from 'react'
import { IconButton } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { Trash2Icon } from 'lucide-react'
import NextImage from 'next/image'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { GoldSparklesEffect } from '../canvas/GoldSparklesEffect'
import { VoteButtonPanel } from './VoteButtonPanel'

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

    const removeGeneration = useMutation(api.generation.remove)

    const votes = useQuery(api.generation.getVotes, { generationId: generation._id })

    return (
      <div
        className="group overflow-hidden rounded-lg border"
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
            <div className="h-full w-full animate-shimmer rounded-lg bg-gradient-to-r from-gold-3 via-gray-1 to-gold-3 bg-[length:400%_100%]"></div>
            <GoldSparklesEffect />
          </>
        )}

        {/* panels */}
        {/* options */}
        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100">
          <IconButton
            variant="surface"
            color="red"
            size="1"
            className="opacity-75 hover:opacity-100"
            onClick={() => {
              removeGeneration({ generationId: generation._id })
                .then(() => toast.success('Generation removed'))
                .catch((err) => {
                  if (err instanceof Error) toast.error(err.message)
                  else toast.error('Unknown error')
                })
            }}
          >
            <Trash2Icon className="size-5" />
          </IconButton>
        </div>

        {/* votes */}
        <VoteButtonPanel generationId={generation._id} votes={votes} />
      </div>
    )
  },
)
