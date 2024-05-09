'use client'

import { forwardRef } from 'react'
import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { Trash2Icon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { api } from '@/convex/_generated/api'
import { getImageGenerationSize } from '@/convex/utils'
import { cn } from '../../lib/utils'
import { GoldSparkles } from '../effects/GoldSparkles'
import { VoteButtonPanel } from './VoteButtonPanel'

import type { Generation } from '@/convex/external'

type GeneratedImageViewProps = {
  generation: Generation
  imageProps?: Partial<React.ComponentProps<typeof NextImage>>
  containerWidth?: number
  containerHeight?: number
  enablePageLink?: boolean
}

export const GeneratedImageView = forwardRef<HTMLDivElement, GeneratedImageViewProps>(
  function GeneratedImageView(
    { generation, imageProps, containerWidth, containerHeight, enablePageLink = true },
    forwardedRef,
  ) {
    const { image } = generation

    const width = image?.width ?? generation.width
    const height = image?.height ?? generation.height
    const isGenerating = !image && generation.result?.type !== 'error'

    const removeGeneration = useMutation(api.generation.remove)

    const sizes = containerWidth
      ? `${containerWidth}px`
      : containerHeight
        ? `${Math.round((containerHeight / height) * width)}px`
        : `(min-width: 768px) 80vw, 100vw`

    return (
      <div
        className={cn(
          'group overflow-hidden rounded-xl',
          !(containerWidth || containerHeight) && 'w-full',
        )}
        style={{ aspectRatio: width / height, width: containerWidth, height: containerHeight }}
        ref={forwardedRef}
      >
        {image && (
          <OptionalLink
            enabled={enablePageLink}
            href={`/image/${generation.rid}`}
            className="block h-full w-full"
          >
            <NextImage
              src={`/i/${image.rid}.webp`}
              fill
              sizes={sizes}
              placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image.blurDataUrl}
              className={'h-full w-full object-cover'}
              alt="generated image"
              {...imageProps}
            />
          </OptionalLink>
        )}

        {isGenerating && (
          <>
            <div className="h-full w-full animate-shimmer rounded-lg bg-gradient-to-r from-gold-3 via-gray-1 to-gold-3 bg-[length:400%_100%]"></div>
            <GoldSparkles />
          </>
        )}

        {/* panels */}
        {/* options */}
        <NonSecureAdminRoleOnly>
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
        </NonSecureAdminRoleOnly>

        {/* votes */}
        {!isGenerating && (
          <VoteButtonPanel generationId={generation._id} votes={generation.votes} />
        )}
      </div>
    )
  },
)

const OptionalLink = ({
  enabled,
  ...props
}: { enabled?: boolean } & React.ComponentProps<typeof Link>) => {
  if (!enabled) return props.children
  return <Link {...props} />
}
