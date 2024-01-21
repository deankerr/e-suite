import { Image as ImageDoc } from '@/convex/types'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_API_URL!

type ImageCProps = {
  className?: TailwindClass
  image: ImageDoc | null
  frame?: { width: number; height: number }
}

export const ImageC = ({ className, image, frame }: ImageCProps) => {
  if (!image) {
    const width = frame?.width ?? 256
    const height = frame?.height ?? 256
    return (
      <div style={{ width, height }} className="bg-red-1A">
        ?
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
      width={image.width / 2}
      height={image.height / 2}
      placeholder="blur"
      blurDataURL={image.blurDataURL}
      className={cn('box-content rounded border border-gold-5', className)}
    />
  )
}
