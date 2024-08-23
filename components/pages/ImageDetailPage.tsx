'use client'

import { Card, DataList } from '@radix-ui/themes'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import Link from 'next/link'

import { IImage } from '@/components/images/IImage'
import { IImageCard } from '@/components/images/IImageCard'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/Carousel'
import { cn } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { EImage, EMessage, EUser } from '@/convex/types'

export const ImageMessageDetailPageLoader = (props: {
  initialImageId: string
  preloadedImageMessage: Preloaded<typeof api.db.images.getImageMessage>
}) => {
  const message = usePreloadedQuery(props.preloadedImageMessage)

  return (
    <>
      <ImageDetailPage
        images={message?.images ?? []}
        currentImageId={props.initialImageId}
        message={message}
      />
    </>
  )
}

export const ImageDetailPage = (props: {
  images: EImage[]
  currentImageId: string
  message?: EMessage | null
}) => {
  const image = props.images.find((image) => image.uid === props.currentImageId)

  return (
    <>
      <div className="grid h-full w-full grid-rows-[1fr_6rem_auto] overflow-y-auto overflow-x-hidden md:grid-cols-[3fr_1fr] md:grid-rows-[1fr_6rem] md:overflow-y-hidden">
        <div className="p-2 md:overflow-hidden">{image && <IImageCard image={image} />}</div>

        <div className="min-w-64 p-2 md:row-span-2 md:overflow-y-auto">
          <div className="space-y-2">
            {image && <ImageDetailsCards image={image} />}

            {props.message?.name && props.message?.text ? (
              <Card>
                <div className="text-sm">
                  <span className="font-medium">{props.message.name} </span>
                  {props.message.text}
                </div>
              </Card>
            ) : null}
          </div>
        </div>

        <div className={cn('flex-center row-start-2 px-4', props.images.length < 2 && 'hidden')}>
          <Carousel>
            <CarouselContent className="-ml-2 px-1">
              {props.images.map((image) => (
                <CarouselItem key={image.uid} className="basis-24 pl-2">
                  <Link href={`/image/${image.uid}`} className="w-full p-1" replace>
                    <Card
                      className={cn(
                        'aspect-square w-full p-0',
                        image.uid === props.currentImageId && 'outline outline-2 outline-orange-9',
                      )}
                    >
                      <IImage image={image} />
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </>
  )
}

export const ImageDetailsCards = ({ image }: { image: EImage & { user?: EUser } }) => {
  return (
    <>
      {image.captionModelId ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-base font-semibold">{image.captionTitle}</div>
          <p className="text-sm">{image.captionDescription}</p>
          <p className="text-xs">
            caption by{' '}
            <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
          </p>
        </Card>
      ) : null}

      {image.captionOCR ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-sm font-medium">OCR</div>
          <p className="text-sm">{image.captionOCR}</p>
          <p className="text-xs">
            ocr by{' '}
            <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
          </p>
        </Card>
      ) : null}

      {image.generationData ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-sm font-medium">Generation Data</div>
          <DataList.Root orientation="vertical">
            <DataList.Item>
              <DataList.Label>prompt</DataList.Label>
              <DataList.Value>{image.generationData.prompt}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>model</DataList.Label>
              <DataList.Value>{image.generationData.modelName}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>endpoint</DataList.Label>
              <DataList.Value>{image.generationData.endpointId}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>
      ) : null}

      <Card className="space-y-2" size="2">
        <div className="pb-px text-sm font-medium">File Data</div>
        <DataList.Root orientation="vertical">
          <DataList.Item>
            <DataList.Label>created</DataList.Label>
            <DataList.Value suppressHydrationWarning>
              {new Date(image._creationTime).toLocaleString()}
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>dimensions</DataList.Label>
            <DataList.Value>
              {image.width}x{image.height} px
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>uid</DataList.Label>
            <DataList.Value className="font-mono">{image.uid}</DataList.Value>
          </DataList.Item>

          {image.user && (
            <DataList.Item>
              <DataList.Label>user</DataList.Label>
              <DataList.Value className="font-mono">{image.user?.name}</DataList.Value>
            </DataList.Item>
          )}
        </DataList.Root>
      </Card>
    </>
  )
}
