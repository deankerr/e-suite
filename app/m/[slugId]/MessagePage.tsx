'use client'

import { UserButton } from '@clerk/nextjs'
import { AspectRatio, Card, Code, DataList, Separator } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ChevronLeftIcon, MessageSquareIcon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { z } from 'zod'

import { IconButton } from '@/components/ui/IconButton'
import { api } from '@/convex/_generated/api'
import { generationFields } from '@/convex/schema'

const thumbnailHeightRem = 32

const generationSchema = z.object(generationFields).nullish()

type MessagePageProps = { slugId: string }

export const MessagePage = ({ slugId }: MessagePageProps) => {
  const message = useQuery(api.messages.getBySlugId, { slugId })
  const generationQuery = useQuery(
    api.generation.getByMessageId,
    message?._id ? { messageId: message?._id } : 'skip',
  )
  const generation = generationSchema.parse(generationQuery?.generation)
  const generationDataList = generation ? [...Object.entries(generation)] : []

  const generated_images = generationQuery?.generated_images

  return (
    <div>
      {/* header */}
      <header className="grid h-14 grid-cols-2 px-2">
        {/* title */}
        <div className="flex items-center gap-2 font-medium">
          <IconButton variant="ghost" asChild>
            <Link href={'/dashboard'}>
              <ChevronLeftIcon className="stroke-[1.5] text-gray-11" />
            </Link>
          </IconButton>
          <MessageSquareIcon className="stroke-[1.5]" />
          {message?.name && <span>{message.name} </span>}
          {message?.role}
        </div>

        <div className="flex items-center justify-end gap-2 pr-2">
          <UserButton />
        </div>
      </header>

      <div className="px-3">
        <Separator size="4" />
      </div>

      {message?.content && <Card variant="classic">{message.content}</Card>}

      {generated_images && (
        <div className="grid gap-4 p-1 sm:grid-cols-[1fr_240px] sm:p-4">
          {/* images */}
          <div className="flex-center flex-wrap gap-4">
            {generated_images?.map((image) => {
              const { width, height, blurDataUrl } = image
              const heightRatio = thumbnailHeightRem / height
              const adjustedWidth = heightRatio * width
              const url = getImageUrl(image.slugId)
              return (
                <div
                  key={image._id}
                  className="border-gold-7 max-w-full shrink-0 overflow-hidden rounded-lg border"
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
                    <Code color="gold">{generation.model_id}</Code>
                  </DataList.Value>
                </DataList.Item>

                {/* <DataList.Item>
                  <DataList.Label>prompt</DataList.Label>
                  <DataList.Value>{generation.prompt}</DataList.Value>
                </DataList.Item> */}

                <DataList.Item>
                  <DataList.Label>dimensions</DataList.Label>
                  <DataList.Value>
                    <Code color="gray" variant="ghost">
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
