'use client'

import { AspectRatio, Card, Code, DataList } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'
import { z } from 'zod'

import { api } from '@/convex/_generated/api'
import { generationFields } from '@/convex/schema'
import { useMessageQuery } from './queries'

const thumbnailHeightRem = 32

const generationSchema = z.object(generationFields).nullish()

type MessagePageProps = { slugId: string }

export const MessagePage = ({ slugId }: MessagePageProps) => {
  const message = useMessageQuery({ slugId })

  const generationQuery = useQuery(
    api.generation.getByMessageId,
    message?._id ? { messageId: message?._id } : 'skip',
  )
  const generation = generationSchema.parse(generationQuery?.generation)
  const generationDataList = generation ? [...Object.entries(generation)] : []

  const generated_images = generationQuery?.generated_images
  const model = generationQuery?.model

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
                    {/* <Code color="gray">{generation.model_id}</Code> */}
                    {model?.name}
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
                      <DataList.Value>{value}</DataList.Value>
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
