'use client'

import { AspectRatio } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { api } from '@/convex/_generated/api'

type ImagePageProps = { slugId: string }

export const ImagePage = ({ slugId }: ImagePageProps) => {
  const result = useQuery(api.generated_images.getBySlugId, slugId ? { slugId } : 'skip')
  const image = result?.image
  // const generation = result?.generation

  return (
    <div>
      <div className="flex justify-center p-1 sm:px-4 sm:py-8">
        {image && (
          <div
            className="max-w-full shrink-0 overflow-hidden rounded-lg border border-gold-7"
            style={{ width: image.width }}
          >
            <AspectRatio ratio={image.width / image.height}>
              <NextImage
                unoptimized
                src={getImageUrl(image.slugId)}
                alt=""
                placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={image.blurDataUrl}
                width={image.width}
                height={image.height}
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </div>
  )
}

const getImageUrl = (fileId: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site')
  const url = new URL('i', siteUrl)
  url.searchParams.set('id', fileId)

  return url.toString()
}
