'use client'

import Link from 'next/link'

import { Image } from '@/components/images/Image'

import type { EImage } from '@/convex/types'

export const ImagesList = ({ images }: { images: EImage[] }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid auto-rows-max grid-cols-3 gap-2 p-2 xl:grid-cols-4">
        {images.map((image) => (
          <Link
            key={image._id}
            href={`/image/${image.uid}`}
            className="overflow-hidden rounded-md border border-grayA-3"
            style={{ aspectRatio: image.width / image.height }}
          >
            <Image
              alt=""
              src={`/i/${image.uid}`}
              placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image?.blurDataUrl}
              style={{
                objectFit: 'contain',
                objectPosition: 'top',
              }}
              fill
              sizes="(max-width: 1280px) 33vw, 25vw"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
