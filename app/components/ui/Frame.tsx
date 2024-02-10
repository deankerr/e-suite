import { Id } from '@/convex/_generated/dataModel'
import { Image } from '@/convex/types'
import { cn } from '@/lib/utils'
import { AlertOctagonIcon } from 'lucide-react'
import NextImage from 'next/image'

type EImageProps = {
  image?: Image | null
  frameWidth?: number //* used for frames if image is missing/is being generated
  frameHeight?: number //* should eventually not need this
  isError?: boolean
} & Omit<React.ComponentProps<typeof NextImage>, 'src'>

export const Frame = ({
  image,
  frameWidth,
  frameHeight,
  className,
  isError,
  ...imageProps
}: EImageProps) => {
  if (!image)
    return (
      <EmptyFrame width={frameWidth} height={frameHeight} isError={isError || image === null} />
    )

  const { width, height, blurDataURL } = image

  return (
    <NextImage
      {...imageProps}
      src={getConvexLink(image.storageId)}
      width={width}
      height={height}
      blurDataURL={blurDataURL}
      placeholder="blur"
      className={cn('', className)}
    />
  )
}

const EmptyFrame = ({
  width = 1,
  height = 2,
  isError,
  className,
}: {
  width?: number
  height?: number
  isError: boolean
} & React.ComponentProps<'div'>) => {
  const aspect = height > width ? 'aspect-[2/3]' : height < width ? 'aspect-[3/2]' : 'aspect-square'

  return (
    <div
      className={cn(
        'motion-safe:noisey grid h-auto place-content-center overflow-hidden rounded border bg-blue-3 text-blue-5A motion-safe:animate-pulse',
        aspect,
        isError && 'bg-red-3 text-red-5A',
        className,
      )}
    >
      {isError ? (
        <AlertOctagonIcon className="size-8" />
      ) : (
        <div className="absolute -inset-x-[5%] inset-y-[90%] h-16 w-[110%] bg-blue-4A blur-xl motion-safe:animate-wipedown" />
      )}
    </div>
  )
}

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!

const getConvexLink = (storageId: Id<'_storage'>) => {
  const url = new URL(`${convexSiteUrl}/image`)
  url.searchParams.set('storageId', storageId)
  return url.toString()
}
