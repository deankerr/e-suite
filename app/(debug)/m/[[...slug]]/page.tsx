'use client'

import { Card } from '@radix-ui/themes'
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
          <NextImage
            src={image.storageUrl}
            alt=""
            key={image._id}
            width={image.width}
            height={image.height}
          />
        )
      })
    : undefined

  return (
    <div className="flex-center w-full p-4">
      <Card className="aspect-square max-h-full p-4">
        <div className="grid grid-cols-2">{images}</div>
      </Card>
    </div>
  )
}
