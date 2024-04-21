'use client'

import { AspectRatio, Card, Code, DataList } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { PageHeader } from '../../PageHeader'
import { useMessageQuery } from './queries'

const RevealEffect = dynamic(() => import('@/components/ui/CanvasRevealEffect'))

const thumbnailHeightRem = 32

type MessagePageProps = { slugId: string; showLoader?: boolean }

export const MessagePage = ({ slugId, showLoader = false }: MessagePageProps) => {
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
      <PageHeader
        icon={<MessageSquareIcon />}
        title={result?.title ?? ''}
        backNav={`/t/${result?.thread.slugId ?? ''}`}
      />

      {message?.content && <Card variant="classic">{message.content}</Card>}

      {generated_images && (
        <div className="grid gap-4 px-4 py-6 sm:grid-cols-[1fr_240px]">
          {/* loading effect */}
          {showLoader && (
            <RevealEffect
              animationSpeed={5}
              colors={[[151, 131, 101]]}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={2}
              className={cn('absolute inset-0 -z-30')}
            />
          )}

          {/* images */}
          <div className="mx-auto grid h-fit w-fit gap-4 sm:grid-cols-2">
            {generated_images?.map((image) => {
              const { width, height, blurDataUrl } = image
              const heightRatio = thumbnailHeightRem / height
              const adjustedWidth = heightRatio * width
              const url = getImageUrl(image.slugId)
              return (
                <Link key={image._id} href={`/i/${image.slugId}`}>
                  <div
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
                </Link>
              )
            })}
          </div>

          {/* details */}
          <div className="h-fit rounded-lg border bg-panel-solid p-4">
            {generation && (
              <DataList.Root orientation="vertical" size="2" className="overflow-hidden">
                <DataList.Item>
                  <DataList.Label>model id</DataList.Label>
                  <DataList.Value>
                    {generation.model}
                    <Code color="gold" className="mx-1">
                      {generation.model_id}
                    </Code>
                  </DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>prompt</DataList.Label>
                  <DataList.Value>{generation.prompt}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>dimensions</DataList.Label>
                  <DataList.Value>
                    <Code color="gold" variant="ghost">
                      {generation.width} x {generation.height}
                    </Code>
                  </DataList.Value>
                </DataList.Item>

                {generationDataList.map(([key, value]) => {
                  if (
                    [
                      'model_id',
                      'model',
                      'prompt',
                      'width',
                      'height',
                      '_id',
                      '_creationTime',
                      'messageId',
                    ].includes(key)
                  )
                    return null
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
