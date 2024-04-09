'use client'

import { Card, Quote, Separator } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { CanvasRevealEffect } from '@/components/ui/CanvasRevealEffect'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { ClassNameValue, cn } from '@/lib/utils'

type ImageGen = { width: number; height: number; imageId: Id<'images'> | null }

type MasonryGalleryProps = {
  title?: string
  byline?: string
  imageGens: ImageGen[]
} & React.ComponentProps<'div'>

export const MasonryGallery = ({
  title,
  byline,
  imageGens,
  className,
  ...props
}: MasonryGalleryProps) => {
  const imageIds = imageGens.map(({ imageId }) => imageId)
  const images = useQuery(api.files.images.getMany, { imageIds })

  let por = 1
  let sqr = 1
  const lan = 1

  const imageFrames = imageGens.map((gen, i) => {
    const image = images?.[i] ?? gen
    const ratio = image.width / image.height
    const order = ratio < 1 ? por++ : ratio > 1 ? lan : sqr++

    return {
      ...image,
      order,
    }
  })

  if (!imageFrames) return
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
        {imageFrames.map((image, i) => (
          <Img key={i} image={image} style={{ order: image.order }} />
        ))}
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
  image: (ImageGen | Doc<'images'>) | null | undefined
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
