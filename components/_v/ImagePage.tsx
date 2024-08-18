'use client'

import { Card, DataList } from '@radix-ui/themes'
import Link from 'next/link'

import { Image } from '@/components/images/Image'
import { EmptyPage } from '@/components/pages/EmptyPage'
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
    return null
  }

  return (
    <>
      <div className="mx-auto grid h-full w-full max-w-7xl gap-2 overflow-y-auto p-2 md:grid-cols-[2fr_1fr]">
        <div className="space-y-2">
          <div
            className="overflow-hidden rounded-md border border-grayA-3"
            style={{ aspectRatio: image.width / image.height, maxWidth: '100%' }}
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

          <div className="flex-center overflow-hidden">
            <ImagePicker images={message?.images ?? []} activeUid={image.uid} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md space-y-3">
          <ImageDetailsCards image={image} />
          {message?.name && message?.text ? (
            <Card className="break-all text-sm">
              <span className="font-semibold">{message.name}</span> {message.text}
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
      {image.captionModelId ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-base font-semibold">{image.captionTitle}</div>
          <p className="text-sm">{image.captionDescription}</p>
          <p className="text-xs">
            caption by{' '}
            <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
          </p>
        </Card>
      ) : null}

      {image.captionOCR ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px font-medium">OCR</div>
          <p className="text-sm">{image.captionOCR}</p>
          <p className="text-xs">
            ocr by{' '}
            <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
          </p>
        </Card>
      ) : null}

      {image.generationData ? (
        <Card className="space-y-2" size="2">
          <div className="pb-px font-medium">Generation Data</div>
          <DataList.Root orientation="vertical">
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
        <DataList.Root orientation="vertical">
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

const ImagePicker = ({ images, activeUid }: { images: EImage[]; activeUid?: string }) => {
  return (
    <div className="grid max-w-md grid-cols-[repeat(auto-fit,8rem)] gap-2 p-2">
      {images.map((image) => (
        <Link
          key={image._id}
          href={`/image/${image.uid}`}
          className={cn(
            'aspect-square overflow-hidden rounded-md border-2 border-gray-3',
            activeUid === image.uid && 'border-accent-9',
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
