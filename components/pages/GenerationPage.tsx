'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, Card, IconButton } from '@radix-ui/themes'

import { ImageModelCardH, ImageModelCardHSkeleton } from '@/components/cards/ImageModelCard'
import { Image } from '@/components/images/Image'
import { ImageCard } from '@/components/images/ImageCard'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useImageModel } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EMessage, EThread, TextToImageConfig } from '@/convex/types'

export const GenerationPage = ({
  message,
  textToImageConfig,
  className,
  ...props
}: {
  thread?: Omit<EThread, 'model'>
  message: EMessage
  textToImageConfig: TextToImageConfig
} & React.ComponentProps<'div'>) => {
  const imageModel = useImageModel({ resourceKey: textToImageConfig.resourceKey })

  return (
    <div
      {...props}
      className={cn('flex h-full w-full overflow-y-auto overscroll-y-contain', className)}
    >
      {/* image grid */}
      <div className="grid max-h-full grid-cols-2 grid-rows-2 gap-4 overflow-hidden p-4">
        {message.images.map((image) => (
          <ImageCard
            key={image._id}
            image={image}
            imageProps={{ priority: true }}
            className="max-h-full"
          />
        ))}
      </div>

      {/* details column */}
      <div className="w-96 shrink-0">
        <div className="mx-auto flex flex-col gap-4">
          {imageModel ? (
            <ImageModelCardH model={imageModel} className="mx-auto" />
          ) : (
            <ImageModelCardHSkeleton />
          )}

          <Card className="flex flex-col gap-2">
            <div className="text-lg font-medium">Generation Data</div>

            <div className="">
              <div className="text-sm font-medium text-gray-11">Prompt</div>
              <div>{textToImageConfig.prompt}</div>
            </div>

            <div className="">
              <div className="text-sm font-medium text-gray-11">Size</div>
              <div>
                {textToImageConfig.width}x{textToImageConfig.height} px
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
