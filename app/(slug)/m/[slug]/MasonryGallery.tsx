'use client'

import { Callout, Card, Quote, Separator } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { AlertOctagonIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'

import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'

const RevealEffect = dynamic(() => import('@/components/ui/CanvasRevealEffect'))

type DimensionsOrder = { width: number; height: number; order: number }
type Generation = DimensionsOrder | Doc<'images'>

type MasonryGalleryProps = {
  title: string
  byline: string
  dimensions: Array<{ width: number; height: number; n: number }>
  imageIds: Id<'images'>[]
  errorMessage?: string
} & React.ComponentProps<'div'>

export const MasonryGallery = ({
  title,
  byline,
  dimensions,
  imageIds,
  errorMessage,
  className,
  ...props
}: MasonryGalleryProps) => {
  const images = useQuery(api.files.images.getMany, { imageIds })

  // create a stable map of placeholder/complete image dimensions
  // loosely spread out each dimension with css orders
  const dimensionSlots = dimensions
    .sort((a, b) => b.width + b.height - (a.width + a.height))
    .map(({ width, height, n }) => {
      const matchingImages =
        images?.filter((image) => image?.width === width && image?.height === height) ?? []

      return Array.from({ length: n }).map((_, i) => {
        const imageOrPlaceholder = matchingImages[i] ?? { width, height }
        return { ...imageOrPlaceholder, order: i + 1 }
      })
    })
    .flat()

  return (
    <div {...props} className={cn('mx-auto max-w-7xl px-4 py-4', className)}>
      {/* title */}
      <Card className="mx-auto w-fit">
        <div className="flex-col-center gap-2 py-1 sm:px-8">
          <Quote
            className={cn(
              'line-clamp-3 break-all text-center',
              title.length > 100 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl',
            )}
          >
            {title}
          </Quote>
          <Separator size="4" />
          <p className="pt-1 text-center font-merriweather text-sm sm:text-base">{byline}</p>
        </div>
      </Card>

      <div className="grid grid-flow-row-dense auto-rows-[160px] grid-cols-[repeat(auto-fit,_minmax(128px,_1fr))] gap-4 py-4">
        {!errorMessage
          ? dimensionSlots.map((image, i) => {
              const key = `${image.width}|${image.height}|${i}`
              return <MasonryImage key={key} order={image.order} image={image} className="" />
            })
          : null}
      </div>

      {errorMessage ? (
        <Callout.Root color="red" role="alert" className="mx-auto w-fit">
          <Callout.Icon>
            <AlertOctagonIcon className="animate-pulse" />
          </Callout.Icon>
          <Callout.Text className="border-b border-red-6 pb-1">
            (sinkin.ai) endpoint returned error:
          </Callout.Text>
          <Callout.Text className="">{errorMessage}</Callout.Text>
        </Callout.Root>
      ) : null}
    </div>
  )
}

function MasonryImage({
  image,
  order = 0,
  showLoader = false,
  className,
  ...props
}: {
  order?: number
  showLoader?: boolean
  image: Generation
} & React.ComponentProps<'div'>) {
  const styles = getImageProps(image.width, image.height)

  const storageUrl = 'storageUrl' in image ? image.storageUrl : undefined
  const blurDataURL = 'blurDataURL' in image ? image.blurDataURL : undefined

  return (
    <Card
      {...props}
      className={cn(styles.grid, className)}
      style={{ order, maxWidth: image.width }}
    >
      {!storageUrl || showLoader ? (
        <RevealEffect
          animationSpeed={3}
          colors={[
            [255, 128, 31],
            [254, 137, 198],
          ]}
          dotSize={3}
          className={cn(
            'h-full w-full rounded border border-gray-6 object-cover object-center p-0.5',
            styles.aspect,
          )}
        />
      ) : (
        <NextImage
          alt=""
          src={storageUrl}
          width={image.width}
          height={image.height}
          placeholder="blur"
          blurDataURL={blurDataURL}
          className={cn('h-full w-full rounded border border-gray-6 object-cover object-center')}
        />
      )}
    </Card>
  )
}

const getImageProps = (width: number, height: number) => {
  if (width < height) {
    return {
      grid: 'col-span-2 row-span-3',
      aspect: 'aspect-[2/3]',
    }
  }

  if (width > height) {
    return {
      grid: 'col-span-3 row-span-2',
      aspect: 'aspect-[3/2]',
    }
  }

  return { grid: 'col-span-2 row-span-2', aspect: 'aspect-square' }
}
