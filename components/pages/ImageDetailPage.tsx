'use client'

import { Card, DataList } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { IImage } from '@/components/images/IImage'
import { IImageCard } from '@/components/images/IImageCard'
import { api } from '@/convex/_generated/api'
import { useCacheQuery } from '@/lib/api'
import { cn } from '@/lib/utils'

import type {
  EImage,
  EImageGenerationData,
  EImageMetadata,
  RunConfigTextToImage,
} from '@/convex/types'

export const ImageDetailPage = ({ imageId }: { imageId: string }) => {
  const image = useQuery(api.db.images.get, {
    id: imageId,
  })

  const messageId = image?.generation?.messageId
  const message = useCacheQuery(api.db.messages.getDoc, messageId ? { messageId } : 'skip')

  const images =
    useCacheQuery(
      api.db.images.getGenerationImages,
      image?.generationId
        ? {
            generationId: image.generationId,
          }
        : 'skip',
    ) ?? []

  if (!image) return null
  const currentImageId = image.id

  return (
    <>
      <div className="grid h-full w-full grid-rows-[1fr_6rem_auto] overflow-y-auto overflow-x-hidden md:grid-cols-[3fr_1fr] md:grid-rows-[1fr_8rem] md:overflow-y-hidden">
        <div>
          <div className="p-2 md:overflow-hidden">
            {image && <IImageCard image={image} sizes="(min-width: 768px) 75vw, 100vw" />}
          </div>

          <div className={cn('flex-center p-1', images.length < 2 && 'hidden')}>
            <div className="flex gap-2">
              {images.map((image) => (
                <div key={image.id} className="h-28 w-28 overflow-hidden">
                  <IImage image={image} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-72 p-2 md:row-span-2 md:overflow-y-auto">
          <div className="space-y-2">
            {image && <ImageDetailsCards image={image} />}
            {image.generation && <ImageGenerationDataCard generation={image.generation} />}

            {message?.name && message?.text ? (
              <Card>
                <div className="text-sm">
                  <span className="font-medium">{message.name} </span>
                  {message.text}
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

const ImageDetailsCards = ({ image }: { image: EImage }) => {
  return (
    <>
      <ImageCaptionOCRV0Cards metadata={image.metadata} />
      <ImageCaptionOCRV1Cards metadata={image.metadata} />
      <ImageGenerationDataV0Card metadata={image.metadata} />
      <ImageFileDataCard image={image} />
    </>
  )
}

const ImageGenerationDataCard = ({ generation }: { generation: EImageGenerationData }) => {
  if (!generation) return null
  const input = generation.input as RunConfigTextToImage
  return (
    <Card className="space-y-2" size="2">
      <div className="pb-px text-sm font-medium">Generation Data</div>
      <DataList.Root orientation="vertical">
        <DataList.Item>
          <DataList.Label>prompt</DataList.Label>
          <DataList.Value>{input.prompt}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>model</DataList.Label>
          <DataList.Value>{input.resourceKey.split('::')[1]}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>endpoint</DataList.Label>
          <DataList.Value>{input.resourceKey.split('::')[0]}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  )
}

const ImageCaptionOCRV1Cards = ({ metadata }: { metadata: EImageMetadata[] }) => {
  const data = metadata.find((m) => m.type === 'captionOCR_V1')
  if (!data) return null

  return (
    <>
      <Card className="space-y-2" size="2">
        <div className="pb-px text-base font-semibold">{data.title}</div>
        {data.description.split('.').map(
          (chunk, index) =>
            chunk && (
              <p key={index} className="text-sm">
                {chunk}.
              </p>
            ),
        )}
        <p className="text-xs">
          caption by <span className="font-mono text-[0.95em] text-gray-11">{data.modelId}</span>
        </p>
      </Card>

      {data.ocr_texts.length > 0 && (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-sm font-medium">OCR</div>
          <p className="text-sm">{data.ocr_texts.join('\n')}</p>
          <p className="text-xs">
            ocr by <span className="font-mono text-[0.95em] text-gray-11">{data.modelId}</span>
          </p>
        </Card>
      )}
    </>
  )
}

const ImageCaptionOCRV0Cards = ({ metadata }: { metadata: EImageMetadata[] }) => {
  const data = metadata.find((m) => m.type === 'captionOCR_V0')
  if (!data) return null

  return (
    <>
      <Card className="space-y-2" size="2">
        <div className="pb-px text-base font-semibold">{data.captionTitle}</div>
        <p className="text-sm">{data.captionDescription}</p>
        <p className="text-xs">
          caption by{' '}
          <span className="font-mono text-[0.95em] text-gray-11">{data.captionModelId}</span>
        </p>
      </Card>

      <Card className="space-y-2" size="2">
        <div className="pb-px text-sm font-medium">OCR</div>
        <p className="text-sm">{data.captionOCR}</p>
        <p className="text-xs">
          ocr by <span className="font-mono text-[0.95em] text-gray-11">{data.captionModelId}</span>
        </p>
      </Card>
    </>
  )
}

const ImageGenerationDataV0Card = ({ metadata }: { metadata: EImageMetadata[] }) => {
  const data = metadata.find((m) => m.type === 'generationData_V0')
  if (!data) return null

  return (
    <Card className="space-y-2" size="2">
      <div className="pb-px text-sm font-medium">Generation Data</div>
      <DataList.Root orientation="vertical">
        <DataList.Item>
          <DataList.Label>prompt</DataList.Label>
          <DataList.Value>{data.prompt}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>model</DataList.Label>
          <DataList.Value>{data.modelName}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>endpoint</DataList.Label>
          <DataList.Value>{data.endpointId}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  )
}

const ImageFileDataCard = ({ image }: { image: EImage }) => {
  return (
    <Card className="space-y-2" size="2">
      <div className="pb-px text-sm font-medium">File Data</div>
      <DataList.Root orientation="vertical">
        <DataList.Item>
          <DataList.Label>created</DataList.Label>
          <DataList.Value suppressHydrationWarning>
            {new Date(image.originalCreationTime ?? image._creationTime).toLocaleString()}
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>dimensions</DataList.Label>
          <DataList.Value>
            {image.width}x{image.height} px
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>id</DataList.Label>
          <DataList.Value className="font-mono">{image.id}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  )
}
