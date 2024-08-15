import { Card, DataList } from '@radix-ui/themes'

import { Image } from '@/components/images/Image'

import type { EImage, EUser } from '@/convex/types'

export const ImageDetailsPage = ({ image }: { image: EImage & { user: EUser } }) => {
  return (
    <div className="grid h-full grid-cols-[1fr_28rem] gap-2 p-2 text-sm">
      <div className="overflow-hidden">
        <Image
          key={image._id}
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
      </div>

      <div className="w-96 space-y-3 justify-self-center overflow-y-auto">
        <Card className="space-y-2" size="2">
          <div className="border-b border-grayA-5 pb-px text-base font-semibold">
            {image.captionTitle}
          </div>
          <p>{image.captionDescription}</p>
          <p className="text-xs">
            caption by{' '}
            <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
          </p>
        </Card>

        {image.captionOCR ? (
          <Card className="space-y-2" size="2">
            <div className="border-b border-grayA-5 pb-px font-medium">OCR</div>
            <p>{image.captionOCR}</p>
            <p className="text-xs">
              ocr by{' '}
              <span className="font-mono text-[0.95em] text-gray-11">{image.captionModelId}</span>
            </p>
          </Card>
        ) : null}

        {image.generationData ? (
          <Card className="space-y-2" size="2">
            <div className="border-b border-grayA-5 pb-px font-medium">Generation Data</div>
            <DataList.Root size="2" orientation="horizontal">
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
          <div className="border-b border-grayA-5 pb-px font-medium">File Data</div>
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
      </div>
    </div>
  )
}
