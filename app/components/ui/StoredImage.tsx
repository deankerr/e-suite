import { Id } from '@/convex/_generated/dataModel'
import type { StoredImage as StoredImageType } from '@/convex/files/images'
import { cn } from '@/lib/utils'
import { AlertOctagonIcon } from 'lucide-react'
import NextImage from 'next/image'
import { forwardRef } from 'react'

type Props = {
  image: StoredImageType
}

export const StoredImage = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function StoredImage({ image, className, ...props }, forwardedRef) {
    const { width, height, blurDataURL, storageId, job } = image
    const aspect =
      height > width ? 'aspect-[2/3]' : height < width ? 'aspect-[3/2]' : 'aspect-square'

    return (
      <div
        {...props}
        style={{ width }}
        className={cn(getStatusStyle(job?.status), aspect, className)}
        ref={forwardedRef}
      >
        {storageId ? (
          <NextImage
            src={getConvexLink(storageId)}
            alt="generated image"
            width={width}
            height={height}
            blurDataURL={blurDataURL}
            placeholder="blur"
          />
        ) : job?.status === 'pending' ? (
          <div className="absolute -inset-x-[5%] inset-y-[90%] h-16 w-[110%] bg-blue-4A blur-xl motion-safe:animate-wipedown" />
        ) : (
          <>
            {job?.status === 'error' && <AlertOctagonIcon className="size-8" />}
            <span className="">{job?.message}</span>
          </>
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

const statusCn =
  'motion-safe:noisey h-auto flex flex-col justify-center items-center overflow-hidden rounded border motion-safe:animate-pulse'

const getStatusStyle = (status?: string) => {
  if (!status || status === 'complete') return ''
  return cn(
    statusCn,
    status === 'pending' && 'bg-blue-3 text-blue-5A',
    status === 'error' && 'bg-red-3 text-red-5A',
  )
}
