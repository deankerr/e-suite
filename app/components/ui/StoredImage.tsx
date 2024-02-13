import { Id } from '@/convex/_generated/dataModel'
import type { get } from '@/convex/files/images'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'
import { forwardRef } from 'react'

type Props = {
  image: Awaited<ReturnType<typeof get>>
}

export const StoredImage = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function StoredImage({ image, className, ...props }, forwardedRef) {
    const { width, height, blurDataURL, storageId } = image
    const aspect =
      height > width ? 'aspect-[2/3]' : height < width ? 'aspect-[3/2]' : 'aspect-square'

    return (
      <div {...props} className={cn('', aspect, className)} ref={forwardedRef}>
        {storageId ? (
          <NextImage
            src={getConvexLink(storageId)}
            alt="generated image"
            width={width}
            height={height}
            blurDataURL={blurDataURL}
            placeholder="blur"
          />
        ) : (
          'not yet'
        )}
      </div>
    )
  },
)

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!
const getConvexLink = (storageId: Id<'_storage'>) => {
  const url = new URL(`${convexSiteUrl}/image`)
  url.searchParams.set('storageId', storageId)
  return url.toString()
}
