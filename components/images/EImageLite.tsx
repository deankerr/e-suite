'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { EImageLoader } from '@/components/images/EImageLoader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const EImageLite = ({
  image,
  sizes,
  priority = false,
  className,
  ...props
}: { image: EImage; sizes?: string; priority?: boolean } & React.ComponentProps<'div'>) => {
  const [showCaption, setShowCaption] = useState(false)
  return (
    <div {...props} className={cn('', className)}>
      <div
        style={{ aspectRatio: image.width / image.height }}
        className="relative flex max-h-full flex-col overflow-hidden rounded-xl border"
      >
        {/* image */}
        <div className="relative flex-grow">
          <EImageLoader
            image={image}
            className="absolute inset-0 rounded-lg"
            sizes={sizes}
            priority={priority}
          />
        </div>

        {/* lower overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex h-full items-end gap-2 overflow-hidden">
          <div className="flex h-full w-full items-end justify-between overflow-hidden p-1">
            <div></div>

            {/* caption */}
            <div
              className={cn(
                'bg-card-1 flex max-h-full flex-col overflow-hidden rounded-lg border border-grayA-6 p-2 text-sm backdrop-blur-xl',
                showCaption ? '' : 'hidden',
              )}
              onClick={(e) => {
                e.stopPropagation()
                setShowCaption(false)
              }}
            >
              {/* text */}
              <div className="max-h-40 overflow-y-auto pb-1">
                {image.captionText}
                {!image.captionText && image.captionModelId && (
                  <LoadingSpinner variant="dots" className="w-4" />
                )}
              </div>
              {/* model/nsfw */}
              <div className="flex shrink-0 items-center justify-between gap-2 pt-1 font-mono text-xs text-gray-11">
                <div className="truncate border border-transparent" title={image.captionModelId}>
                  {image.captionModelId}
                </div>
                {image.nsfwProbability !== undefined && (
                  <div
                    className="shrink-0 rounded border border-grayA-3 px-1"
                    title="nsfw rating"
                  >{`${Math.round(image.nsfwProbability * 100)}%`}</div>
                )}
              </div>
            </div>

            {/* info button */}
            <IconButton
              variant="ghost"
              color="gray"
              size="1"
              radius="large"
              className="shrink-0 border border-grayA-3 backdrop-blur-[2px]"
              onClick={(e) => {
                e.stopPropagation()
                setShowCaption((prev) => !prev)
              }}
            >
              <Icons.Info size={32} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}
