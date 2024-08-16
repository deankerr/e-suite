'use client'

import { Card } from '@radix-ui/themes'

import { Image } from '@/components/images/Image'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { ImageDetailsCards, ImageDetailsPicker } from '@/components/pages/ImageDetailsPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { useImage, useMessageId } from '@/lib/api'

export const ImagePage = ({ params }: { params: { image_id: string } }) => {
  const image = useImage(params.image_id)
  const message = useMessageId(image?.messageId)

  if (image === null) {
    return <EmptyPage />
  }

  if (image === undefined) {
    return <LoadingPage />
  }

  return (
    <>
      <div className="grid h-full grid-cols-[1fr_20rem] grid-rows-[1fr_auto] gap-x-2 gap-y-4 p-2 text-sm">
        <div
          className="col-start-1 justify-self-center overflow-hidden rounded-md border border-grayA-3"
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
              objectPosition: 'center',
            }}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="flex-center col-start-1 row-start-2 h-full w-full">
          <ImageDetailsPicker images={message?.images ?? []} />
        </div>

        <div className="row-span-2 space-y-3 justify-self-center overflow-y-auto">
          <ImageDetailsCards image={image} />
          {message?.name && message?.text ? (
            <Card className="break-all">
              {message.name}: {message.text}
            </Card>
          ) : null}
        </div>
      </div>
    </>
  )
}
