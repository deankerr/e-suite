'use client'

import { Card } from '@radix-ui/themes'

import { Image } from '@/components/images/Image'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { ImageDetailsCards, ImageDetailsPicker } from '@/components/pages/ImageDetailsPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { useImage, useMessageId } from '@/lib/api'

export default function Page({ params }: { params: { slug: string; uid: string } }) {
  const image = useImage(params.uid)
  const message = useMessageId(image?.messageId)

  if (image === null) {
    return <EmptyPage />
  }

  if (image === undefined) {
    return <LoadingPage />
  }

  return (
    <>
      <div className="grid h-4/5 grid-cols-[1fr_20rem] gap-2 p-2 text-sm">
        <div
          className="justify-self-center overflow-hidden rounded-md border border-grayA-3"
          style={{ aspectRatio: image.width / image.height, maxWidth: image.width }}
        >
          <Image
            key={image._id}
            alt=""
            src={`/i/${image.uid}`}
            placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={image?.blurDataUrl}
            style={{
              objectFit: 'contain',
              objectPosition: 'top',
            }}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="space-y-3 justify-self-center overflow-y-auto">
          <ImageDetailsCards image={image} />
          {message?.name && message?.text ? (
            <Card>
              {message.name}: {message.text}
            </Card>
          ) : null}
        </div>
      </div>

      <div className="h-1/5 bg-grayA-1">
        {/* image picker */}
        <div className="flex-center h-full w-full">
          <ImageDetailsPicker images={message?.images ?? []} />
        </div>
      </div>
    </>
  )
}
