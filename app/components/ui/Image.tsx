import { Image as ImageDoc } from '@/convex/types'
import { cn } from '@/lib/utils'
import { AlertOctagonIcon, FileQuestionIcon, HourglassIcon } from 'lucide-react'
import NextImage from 'next/image'

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_API_URL!

const frameClass = 'box-content rounded animate-pulse grid place-content-center max-w-full'

type ImageCProps = {
  className?: TailwindClass
  image?: ImageDoc | null
  size: { width: number; height: number }
  isLoading?: boolean
}

export const ImageC = ({ className, image, size, isLoading = false }: ImageCProps) => {
  //* error
  if (image === null) {
    return (
      <div
        className={cn(frameClass, 'bg-red-3A text-red-6A')}
        style={{ width: size.width, height: '100%' }}
      >
        <AlertOctagonIcon className="size-8" />
      </div>
    )
  }

  //* waiting
  if (!image && isLoading) {
    return (
      <div
        className={cn(frameClass, 'overflow-hidden bg-blue-2A text-blue-5A')}
        style={{ width: size.width, height: '100%' }}
      >
        <HourglassIcon className="size-8" />
        <div className="motion-safe:animate-wipedown absolute inset-y-[90%] h-16 w-full bg-blue-4A blur-xl" />
      </div>
    )
  }

  //* file missing (?)
  if (!image) {
    return (
      <div
        className={cn(frameClass, 'bg-yellow-3A text-yellow-6A')}
        style={{ width: size.width, height: '100%' }}
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
      alt="http image"
      {...size}
      placeholder="blur"
      blurDataURL={image.blurDataURL}
      className={cn('box-content rounded border border-gold-5', className)}
    />
  )
}
