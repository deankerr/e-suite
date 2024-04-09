'use client'

import { Card, Quote, Separator } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { CanvasRevealEffect } from '@/components/ui/CanvasRevealEffect'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { ClassNameValue, cn } from '@/lib/utils'

type DimensionsOrder = { width: number; height: number; order: number }
type Generation = (DimensionsOrder & Doc<'images'>) | null | undefined

type MasonryGalleryProps = {
  title: string
  byline: string
  dimensions: Array<{ width: number; height: number; n: number }>
  imageIds: Id<'images'>[]
} & React.ComponentProps<'div'>

export const MasonryGallery = ({
  title,
  byline,
  dimensions,
  imageIds,
  className,
  ...props
}: MasonryGalleryProps) => {
  const images = useQuery(api.files.images.getMany, { imageIds })

  return (
    <div {...props} className={cn('mx-auto max-w-7xl px-4 py-4', className)}>
      <Card className="">
        <div className="flex-col-center gap-2 py-1 sm:px-8">
          <Quote className="text-center text-3xl">{title}</Quote>
          <Separator size="4" />
          <p className="font-merriweather pt-1 text-center text-sm sm:text-base">{byline}</p>
        </div>
      </Card>

      <div className="grid grid-flow-row-dense grid-cols-[repeat(auto-fit,_minmax(128px,_1fr))] gap-4 py-4">
        {/* images */}
        {dimensions.map(({ width, height, n }, i) => {
          const dimImages =
            images?.filter((img) => img && img.width === width && img.height === height) ??
            new Array(n)
          return dimImages.map((image, j) => (
            <Img key={`${i}|${j}`} image={image ?? { width, height }} />
          ))
        })}
      </div>
    </div>
  )
}

function Img({
  image,
  className,
  ...props
}: {
  className?: ClassNameValue
  image: Generation
} & React.ComponentProps<'div'>) {
  if (!image) return null

  const ratio = image.width / image.height
  const gridCn =
    ratio < 1
      ? 'col-span-2 row-span-3'
      : ratio > 1
        ? 'col-span-3 row-span-2'
        : 'col-span-2 row-span-2'

  const aspectCn = ratio < 1 ? 'aspect-[2/3]' : ratio > 1 ? 'aspect-[3/2]' : 'aspect-square'

  if (!('storageUrl' in image)) {
    return (
      <Card {...props} className={cn(gridCn, aspectCn, className)}>
        <CanvasRevealEffect
          animationSpeed={3}
          className={cn('', className)}
          colors={[
            [255, 128, 31],
            [254, 137, 198],
          ]}
        />
      </Card>
    )
  }

  return (
    <Card {...props} className={cn(gridCn, className)}>
      <NextImage
        key={image._id}
        alt=""
        src={image.storageUrl!}
        width={image.width}
        height={image.height}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={cn('h-full rounded border border-gray-6 object-cover object-center')}
      />
    </Card>
  )
}
