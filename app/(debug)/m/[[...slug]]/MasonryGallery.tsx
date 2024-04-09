'use client'

import { Card, Quote } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { CanvasRevealEffect } from '@/components/ui/CanvasRevealEffect'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { ClassNameValue, cn } from '@/lib/utils'

type ImageGen = { width: number; height: number }

type MasonryGalleryProps = {
  title?: string
  byline?: string
  imageIds: Id<'images'>[]
  imageGen: ImageGen[]
} & React.ComponentProps<'div'>

export const MasonryGallery = ({
  title,
  byline,
  imageIds,
  imageGen,
  className,
  ...props
}: MasonryGalleryProps) => {
  const images = useQuery(api.files.images.getMany, { imageIds })
  const imageFrames = imageGen.map((gen, i) => {
    const image = images?.[i]
    if (!image) return { ...gen, _id: i }
    return image
  })

  if (!imageFrames) return
  // md:grid-rows-[repeat(5,_minmax(0,_150px))]
  return (
    <div
      {...props}
      className={cn('flex h-full w-full flex-col items-center gap-4 px-4', className)}
    >
      <Card className="mt-4">
        <div className="center flex-col-center gap-2 py-2 sm:px-8">
          <Quote className="text-3xl">{title}</Quote>
          <p className="font-merriweather">{byline}</p>
        </div>
      </Card>

      <div className="grid-flow-row-dense flex-col content-start items-start gap-4 sm:grid sm:grid-cols-4 md:grid-cols-[repeat(6,_minmax(0,_150px))]">
        {/* images */}
        {imageFrames.map((image) => (
          <Img key={image._id} image={image} />
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
      <Card className={cn(gridCn, aspectCn, className)}>
        <CanvasRevealEffect
          {...props}
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
    <Card className={cn(gridCn, className)}>
      <NextImage
        key={image._id}
        alt=""
        src={image.storageUrl!}
        width={image.width}
        height={image.height}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={cn('rounded border border-gray-1 object-contain')}
      />
    </Card>
  )
}
