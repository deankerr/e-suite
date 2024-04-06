import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { StaticImage } from '@/components/ui/StaticImage'
import { api } from '@/convex/_generated/api'
import { Message } from '@/convex/messages'
import { GenerationInference } from '@/convex/schema'
import { ClassNameValue, cn } from '@/lib/utils'

type MessageGalleryPageProps = {
  inference: GenerationInference
  content: Message['content']
  className?: ClassNameValue
}

export const MessageGalleryPage = ({ inference, content, className }: MessageGalleryPageProps) => {
  const [title, byline] = inference.title?.split('<by>') ?? [
    'A mysterious creation',
    'by no one (nothing)',
  ]

  const imageIds = Array.isArray(content) ? content.map((f) => f.imageId) : []
  const images = useQuery(api.files.images.getMany, { imageIds })

  return (
    <div className={cn('flex min-h-full flex-col items-center', className)}>
      <div className="space-y-2 p-4">
        <Heading size={hSize.h1} align="center">
          {title}
        </Heading>
        <Heading size={hSize.h2} className="text-gray-11" align="center">
          {byline}
        </Heading>
      </div>

      <div className="flex w-fit flex-wrap justify-center gap-3">
        {images?.map((image) =>
          image ? (
            <Card
              key={image._id}
              className={cn(
                image.height > image.width
                  ? 'max-w-[334px]'
                  : image.width > image.height
                    ? 'max-w-[572px]'
                    : 'max-w-[378px]',
              )}
              style={{ aspectRatio: image.width / image.height }}
            >
              <StaticImage alt="" image={image} className="h-full" />
            </Card>
          ) : null,
        )}
      </div>
    </div>
  )
}

const hSize = {
  h1: {
    initial: '3',
    xs: '6',
  },
  h2: {
    initial: '2',
    xs: '3',
  },
} as const
