'use client'

import { AspectRatio, Card, Code, DataList } from '@radix-ui/themes'
import NextImage from 'next/image'

import { useMessageQuery } from './queries'

const thumbnailHeightRem = 32

type MessagePageProps = { slugId: string }

export const MessagePage = ({ slugId }: MessagePageProps) => {
  const result = useMessageQuery({ slugId })

  const message = result?.message

  const generation = result?.generations[0]
  const generationDataList = generation
    ? Object.entries(generation).filter(([key]) => key !== 'generated_images')
    : []

  const generated_images = result?.generations
    .map(({ generated_images }) => generated_images)
    .flat()
  return (
    <div>
      {message?.content && <Card variant="classic">{message.content}</Card>}

      {generated_images && (
        <div className="grid gap-4 p-1 sm:grid-cols-[1fr_240px] sm:p-4">
          {/* images */}
          <div className="mx-auto grid w-fit gap-4 sm:grid-cols-2">
            {generated_images?.map((image) => {
              const { width, height, blurDataUrl } = image
              const heightRatio = thumbnailHeightRem / height
              const adjustedWidth = heightRatio * width
              const url = getImageUrl(image.slugId)
              return (
                <div
                  key={image._id}
                  className="max-w-full shrink-0 overflow-hidden rounded-lg border border-gold-7"
                  style={{ width: `${adjustedWidth}rem` }}
                >
                  <AspectRatio ratio={width / height}>
                    {url && (
                      <NextImage
                        unoptimized
                        src={url}
                        alt=""
                        placeholder={blurDataUrl ? 'blur' : 'empty'}
                        blurDataURL={blurDataUrl}
                        width={width}
                        height={height}
                        className="object-cover"
                      />
                    )}
                  </AspectRatio>
                </div>
              )
            })}
          </div>

          {/* details */}
          <div className="h-fit border-l pl-3">
            {generation && (
              <DataList.Root orientation="vertical" size="2" className="bg-grayA-1">
                <DataList.Item>
                  <DataList.Label>model id</DataList.Label>
                  <DataList.Value>
                    <Code color="gray">{generation.model_id}</Code>
                    {/* {generation.model?.name} */}
                  </DataList.Value>
                </DataList.Item>

                {/* <DataList.Item>
                  <DataList.Label>prompt</DataList.Label>
                  <DataList.Value>{generation.prompt}</DataList.Value>
                </DataList.Item> */}

                <DataList.Item>
                  <DataList.Label>dimensions</DataList.Label>
                  <DataList.Value>
                    <Code color="gold" variant="ghost">
                      {generation.width} x {generation.height}
                    </Code>
                  </DataList.Value>
                </DataList.Item>

                {generationDataList.map(([key, value]) => {
                  if (['model_id', 'width', 'height'].includes(key)) return null
                  return (
                    <DataList.Item key={key}>
                      <DataList.Label>{key}</DataList.Label>
                      <DataList.Value>{String(value)}</DataList.Value>
                    </DataList.Item>
                  )
                })}
              </DataList.Root>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const getImageUrl = (fileId: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site')
  const url = new URL('i', siteUrl)
  url.searchParams.set('id', fileId)

  return url.toString()
}
