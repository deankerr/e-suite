'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, Card, IconButton } from '@radix-ui/themes'

import { ImageModelCardH, ImageModelCardHSkeleton } from '@/components/cards/ImageModelCard'
import { EImageLoader } from '@/components/images/EImageLoader'
import { Image } from '@/components/images/Image'
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
  const [showCaption, setShowCaption] = useState(false)
  return (
    <div
      {...props}
      className={cn(
        'h-full w-full space-y-4 overflow-y-auto overscroll-y-contain md:grid md:grid-cols-[1fr_20rem] md:space-y-0',
        className,
      )}
    >
      {/* image grid */}
      <div className="grid-cols-2 grid-rows-2 gap-2 space-y-4 self-start overflow-hidden md:grid md:max-h-full md:space-y-0">
        {message.images.map((image) => (
          <div key={image._id} className="[&_>_div]:odd:ml-auto">
            <div
              style={{ aspectRatio: image.width / image.height }}
              className="relative flex max-h-full flex-col overflow-hidden rounded-xl border"
            >
              {/* upper overlay */}
              <div className="absolute inset-x-0 top-0 z-10">
                <div className="flex items-center justify-between px-1 py-2">
                  <div></div>

                  <IconButton variant="ghost" color="gray" size="1">
                    <Icons.DotsThreeVertical size={32} />
                  </IconButton>
                </div>
              </div>

              {/* image */}
              <div className="relative flex-grow">
                <Image
                  key={image._id}
                  alt=""
                  src={image._id}
                  width={image.width}
                  height={image.height}
                  placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={image?.blurDataUrl}
                  className="absolute inset-0 rounded-lg"
                  priority
                />
              </div>

              {/* lower overlay */}
              <div className="absolute inset-x-0 bottom-0 z-10 max-h-full gap-2">
                <div className="flex h-full items-end justify-between p-1">
                  {/* vote buttons */}
                  <div
                    className={cn(
                      'flex h-full items-center rounded-md border border-grayA-3 p-0.5 backdrop-blur-[2px] has-[:hover]:bg-[var(--card-1-light)] has-[:hover]:backdrop-blur-sm',
                      showCaption ? 'hidden' : '',
                    )}
                  >
                    <Button variant="ghost" color="blue" size="1" className="m-0">
                      <Icons.SketchLogo size={16} />5
                    </Button>
                    <Button variant="ghost" color="green" size="1" className="m-0">
                      <Icons.ThumbsUp size={16} />1
                    </Button>
                    <Button variant="ghost" color="yellow" size="1" className="m-0">
                      <Icons.MaskSad size={16} />1
                    </Button>
                    <Button variant="ghost" color="red" size="1" className="m-0">
                      <Icons.Biohazard size={16} />4
                    </Button>
                  </div>

                  {/* caption */}
                  <div
                    className={cn(
                      'bg-card-1 flex h-full flex-col overflow-hidden rounded-lg border border-grayA-6 p-2 text-sm backdrop-blur-xl',
                      showCaption ? '' : 'hidden',
                    )}
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
                      <div
                        className="truncate border border-transparent"
                        title={image.captionModelId}
                      >
                        {image.captionModelId}
                      </div>
                      {image.nsfwProbability !== undefined && (
                        <div className="shrink-0 rounded border px-1">{`${Math.round(image.nsfwProbability * 100)}%`}</div>
                      )}
                    </div>
                  </div>

                  {/* info button */}
                  <IconButton
                    variant="ghost"
                    color="gray"
                    size="1"
                    radius="large"
                    className="shrink-0 border border-grayA-3 backdrop-blur-[1px]"
                    onClick={() => setShowCaption((prev) => !prev)}
                  >
                    <Icons.Info size={32} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* details column */}
      <div className="">
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

            {/* # temp */}
            <Image src="/pixart-cactus.png" width={1000} height={1000} alt="" />
            <Image
              src="https://storage.googleapis.com/falserverless/gallery/scribble.jpeg"
              width={1000}
              height={1000}
              alt=""
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
