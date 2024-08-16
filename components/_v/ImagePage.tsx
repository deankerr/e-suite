'use client'

import { Card, DataList } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Image } from '@/components/images/Image'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { useImage, useMessageId } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EImage, EUser } from '@/convex/types'

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

const ImageDetailsCards = ({ image }: { image: EImage & { user: EUser } }) => {
  return (
    <>
      <Card className="space-y-2" size="2">
        <div className="pb-px text-base font-semibold">{image.captionTitle}</div>
        <p>{image.captionDescription}</p>
        <p className="text-xs">
          caption by{' '}
          <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
        </p>
      </Card>

      {image.captionOCR ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px font-medium">OCR</div>
          <p>{image.captionOCR}</p>
          <p className="text-xs">
            ocr by{' '}
            <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
          </p>
        </Card>
      ) : null}

      {image.generationData ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px font-medium">Generation Data</div>
          <DataList.Root size="2" orientation="vertical">
            <DataList.Item>
              <DataList.Label>prompt</DataList.Label>
              <DataList.Value>{image.generationData.prompt}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>model</DataList.Label>
              <DataList.Value>{image.generationData.modelName}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>endpoint</DataList.Label>
              <DataList.Value>{image.generationData.endpointId}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>
      ) : null}

      <Card className="space-y-3" size="2">
        <div className="pb-px font-medium">File Data</div>
        <DataList.Root size="2" orientation="horizontal">
          <DataList.Item>
            <DataList.Label>created</DataList.Label>
            <DataList.Value>{new Date(image._creationTime).toLocaleString()}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>dimensions</DataList.Label>
            <DataList.Value>
              {image.width}x{image.height} px
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>uid</DataList.Label>
            <DataList.Value className="font-mono">{image.uid}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>user</DataList.Label>
            <DataList.Value className="font-mono">{image.user?.name}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Card>
    </>
  )
}

const ImageDetailsPicker = ({ images }: { images: EImage[] }) => {
  const pathname = usePathname()

  return (
    <div className="grid h-40 auto-cols-[9rem] grid-flow-col gap-2">
      {images.map((image) => (
        <Link
          key={image._id}
          href={`/image/${image.uid}`}
          className={cn(
            'h-36 overflow-hidden rounded-md border-2 border-gray-3',
            pathname.endsWith(image.uid) && 'border-gray-7',
          )}
        >
          <Image
            alt=""
            src={`/i/${image.uid}`}
            placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={image?.blurDataUrl}
            style={{
              objectFit: 'contain',
            }}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </Link>
      ))}
    </div>
  )
}
