'use client'

import { forwardRef } from 'react'
import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { Trash2Icon } from 'lucide-react'
import NextImage from 'next/image'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { GoldSparklesEffect } from '../canvas/GoldSparklesEffect'
import { SpriteIcon } from '../ui/SpriteIcon'

import type { Generation, GenerationVoteNames } from '@/convex/external'

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

    const sendVote = (vote: GenerationVoteNames) => {
      if (!image) return
      const body = JSON.stringify({ vote, generationId: generation._id })
      console.log('send', body)
      fetch('/api/vote', {
        method: 'POST',
        body,
      })
        .then(() => {
          console.log('voted :)')
        })
        .catch((err) => {
          console.error(err)
        })
    }

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

        {/* info */}
        <div className="absolute inset-0 flex-col-between">
          <div className="self-end rounded-lg bg-overlay p-2 flex-end">
            <IconButton
              color="red"
              size="3"
              onClick={() => {
                removeGeneration({ generationId: generation._id })
                  .then(() => toast.success('Generation removed'))
                  .catch((err) => {
                    if (err instanceof Error) toast.error(err.message)
                    else toast.error('Unknown error')
                  })
              }}
            >
              <Trash2Icon className="" />
            </IconButton>
          </div>

          <div className="gap-5 rounded-lg bg-overlay px-3 py-2 flex-between">
            <IconButton variant="solid" size="3" color="red" onClick={() => sendVote('bad')}>
              <SpriteIcon icon="game-icons-skull-crossed-bones" />
            </IconButton>

            <IconButton variant="solid" size="3" color="amber" onClick={() => sendVote('poor')}>
              <SpriteIcon icon="game-icons-thumb-down" className="text-white" />
            </IconButton>

            <IconButton variant="solid" size="3" color="grass" onClick={() => sendVote('good')}>
              <SpriteIcon icon="game-icons-thumb-up" />
            </IconButton>

            <IconButton variant="solid" size="3" color="cyan" onClick={() => sendVote('best')}>
              <SpriteIcon icon="game-icons-laurels-trophy" />
            </IconButton>
          </div>
        </div>
      </div>
    )
  },
)
