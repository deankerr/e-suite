'use client'

import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function MessagePage({ params }: { params: { slug?: [Id<'messages'>] } }) {
  const messageId = params.slug ? params.slug[0] : undefined
  const queryKey = messageId ? { messageId } : 'skip'

  const message = useQuery(api.messages.getContent, queryKey)

  const images = Array.isArray(message?.content)
    ? message.content.map((image) => {
        if (!('storageUrl' in image)) return null
        if (!image.storageUrl || !image.blurDataURL) return null
        return (
          <div key={image._id} className="overflow-hidden">
            <NextImage
              src={image.storageUrl}
              alt=""
              width={image.width}
              height={image.height}
              className="aspect-square h-full object-contain"
            />
          </div>
        )
      })
    : undefined

  const prompt = 'A geometric, abstract, and minimalistic logo of an orange setting sun'
  const model = "I Can't Believe It's Not Photography"
  const author = 'lemmer'

  return (
    <div className="flex-center min-h-full w-full bg-gray-1 p-3 sm:h-full md:p-8">
      <Card className="sm:aspect-square sm:max-h-full sm:p-4">
        <div className="flex h-full flex-col items-center justify-center overflow-hidden">
          <div className="">
            <Heading
              size={{
                initial: '3',
                sm: '5',
              }}
              align="center"
            >
              {prompt}
            </Heading>
            <Heading
              size={{
                initial: '2',
                sm: '3',
              }}
              className="mb-3 mt-2 text-gray-11"
              align="center"
            >{`by ${author} - (${model})`}</Heading>
          </div>
          <div className="grid w-fit grow overflow-hidden rounded border-4 border-panel-translucent sm:aspect-square sm:grid-cols-2 sm:grid-rows-[50%_50%]">
            {images}
          </div>
        </div>
      </Card>
    </div>
  )
}
