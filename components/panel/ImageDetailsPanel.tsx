'use client'

import { Card, DataList } from '@radix-ui/themes'

import { ImageCard } from '@/components/images/ImageCard'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { Panel } from '@/components/panel/Panel'
import { useImage } from '@/lib/api'

export const ImageDetailsPanel = (props: { imageUid: string }) => {
  const image = useImage(props.imageUid)

  if (image === null) {
    return (
      <Panel>
        <EmptyPage />
      </Panel>
    )
  }

  if (image === undefined) {
    return (
      <Panel>
        <LoadingPage />
      </Panel>
    )
  }

  return (
    <Panel>
      <Panel.Content>
        <div className="grid h-full grid-cols-[1fr_24rem] gap-2 bg-gray-1 p-2 text-sm">
          <div className="flex overflow-hidden">
            <ImageCard image={image} className="max-w-full" />
          </div>

          <div className="space-y-3 overflow-y-auto">
            <div className="space-y-2 rounded-md border border-grayA-5 p-3">
              <div className="border-b border-grayA-5 pb-0.5 text-base font-medium">
                {image.captionTitle}
              </div>
              <p>{image.captionDescription}</p>

              <div className="space-y-1">
                <div className="border-b border-grayA-5 font-medium text-gray-11">OCR</div>
                <p>{image.captionOCR}</p>
              </div>

              <div>
                <div className="text-gray-11">caption by</div>{' '}
                <div className="font-mono text-[0.9em]">{image.captionModelId}</div>
              </div>
            </div>

            <Card className="space-y-2" size="2">
              <div className="text-base font-medium">{image.captionTitle}</div>
              <p>{image.captionDescription}</p>
              <p>caption by {image.captionModelId}</p>
            </Card>

            {image.generationData ? (
              <div className="space-y-2 rounded-md border border-grayA-5 p-3">
                <DataList.Root size="2" orientation="horizontal">
                  <div className="col-span-2 border-b border-grayA-5 pb-0.5 font-medium text-gray-11">
                    Generation Data
                  </div>
                  <DataList.Item>
                    <DataList.Label>prompt</DataList.Label>
                    <DataList.Value>{image.generationData.prompt}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>model</DataList.Label>
                    <DataList.Value>{image.generationData.modelName}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>model ID</DataList.Label>
                    <DataList.Value>{image.generationData.modelId}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>endpoint ID</DataList.Label>
                    <DataList.Value>{image.generationData.endpointId}</DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </div>
            ) : null}

            <div className="space-y-2 rounded-md border border-grayA-5 p-3">
              <DataList.Root size="2" orientation="horizontal">
                <div className="col-span-2 border-b border-grayA-5 pb-0.5 font-medium text-gray-11">
                  File Data
                </div>
                <DataList.Item>
                  <DataList.Label>created</DataList.Label>
                  <DataList.Value>{new Date(image._creationTime).toLocaleString()}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>dimensions</DataList.Label>
                  <DataList.Value>
                    {image.width}x{image.height}
                  </DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>uid</DataList.Label>
                  <DataList.Value>{image.uid}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>user</DataList.Label>
                  <DataList.Value>{image.userId}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </div>
          </div>
        </div>
      </Panel.Content>
    </Panel>
  )
}
