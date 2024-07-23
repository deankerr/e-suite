import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, IconButton } from '@radix-ui/themes'
import Link from 'next/link'

import { Image } from '@/components/images/Image'
import { cn, getConvexSiteUrl } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const ImageCard = ({
  image,
  imageProps,
  className,
  ...props
}: {
  image: EImage
  imageProps?: Partial<React.ComponentProps<typeof Image>>
} & React.ComponentProps<typeof Card>) => {
  const [showCaption, setShowCaption] = useState(false)

  return (
    <Card
      style={{ aspectRatio: image.width / image.height, maxWidth: image.width }}
      className={cn('group flex w-full flex-col justify-between gap-2 p-1', className)}
      {...props}
    >
      <Image
        key={image._id}
        alt=""
        src={image._id}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        style={{ objectFit: 'contain' }}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        {...imageProps}
      />

      {/* * top panel * */}
      <div className="flex shrink-0 justify-between">
        <div className="font-mono text-xs text-gray-11">
          {image.width}x{image.height}
        </div>

        <Link href={`${getConvexSiteUrl()}/i/${image._id}?download`}>
          <IconButton
            variant="ghost"
            color="gray"
            size="1"
            className="m-0 group-hover:bg-blackA-4 group-hover:backdrop-blur"
          >
            <Icons.DownloadSimple className="size-6 group-hover:text-white" weight="bold" />
          </IconButton>
        </Link>
      </div>

      {/* * bottom panel * */}
      <div
        className={cn(
          'rounded-md border border-grayA-5 p-2 opacity-50 group-hover:opacity-100',
          showCaption ? 'bg-blackA-7 opacity-100 backdrop-blur' : 'truncate',
        )}
        onClick={() => setShowCaption((prev) => !prev)}
      >
        {image.captionText}
      </div>
    </Card>
  )
}
