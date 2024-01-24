import { Image as ImageDoc } from '@/convex/types'
import { cn } from '@/lib/utils'
import { AlertOctagonIcon, FileQuestionIcon, HourglassIcon } from 'lucide-react'
import NextImage from 'next/image'

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!

const frameClass =
  'box-content rounded animate-pulse grid place-content-center overflow-hidden max-w-full'

type ImageCProps = {
  className?: TailwindClass
  image?: ImageDoc | null
  width?: number
  height?: number
  alt: string
  isLoading?: boolean
}

export const ImageC = ({
  className,
  image,
  width,
  height,
  alt,
  isLoading = false,
}: ImageCProps) => {
  //* error
  if (image === null) {
    return (
      <div className={cn(frameClass, 'bg-red-3A text-red-6A')} style={{ width, height: '100%' }}>
        <AlertOctagonIcon className="size-8" />
      </div>
    )
  }

  //* waiting
  if (!image && isLoading) {
    return (
      <div className={cn(frameClass, 'bg-blue-2A text-blue-5A')} style={{ width, height: '100%' }}>
        <HourglassIcon className="size-8" />
        <div className="absolute inset-y-[90%] h-16 w-full bg-blue-4A blur-xl motion-safe:animate-wipedown" />
      </div>
    )
  }

  //* file missing (?)
  if (!image) {
    return (
      <div
        className={cn(frameClass, 'bg-yellow-3A text-yellow-6A')}
        style={{ width, height: '100%' }}
      >
        <FileQuestionIcon className="size-8" />
      </div>
    )
  }

  const endpoint = new URL(`${convexSiteUrl}/image`)
  endpoint.searchParams.set('storageId', image.storageId)
  const url = endpoint.toString()

  return (
    <NextImage
      src={url}
      alt={alt}
      width={width ?? image.width}
      height={height ?? image.height}
      placeholder="blur"
      blurDataURL={image.blurDataURL}
      className={cn('box-content rounded border border-gold-5', className)}
    />
  )
}
