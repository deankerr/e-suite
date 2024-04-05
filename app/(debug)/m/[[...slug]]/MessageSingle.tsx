import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { api } from '@/convex/_generated/api'
import { Ent } from '@/convex/types'
import { ClassNameValue, cn } from '@/lib/utils'

import type { Message } from '@/convex/messages'
import type { GenerationInference } from '@/convex/schema'

type MessageSingleProps = {
  message: Message
} & React.ComponentProps<'div'>

export const MessageSingle = ({ message }: MessageSingleProps) => {
  // MessageSingle
  const { content } = message
  const generation = message.inference?.type === 'textToImage' ? message.inference : undefined
  const fileContent = typeof content !== 'string' ? content : []

  if (generation && fileContent) {
    fileContent
  }
  return (
    generation && fileContent && <MessageGallery inference={generation} fileContent={fileContent} />
  )
}

const hSize = {
  h1: {
    initial: '3',
    xs: '5',
  },
  h2: {
    initial: '2',
    xs: '3',
  },
} as const

type MessageGalleryProps = {
  inference: GenerationInference
  fileContent: {
    type: 'image'
    imageId: string & {
      __tableName: 'images'
    }
  }[]
  className?: ClassNameValue
}

export const MessageGallery = ({ inference, fileContent, className }: MessageGalleryProps) => {
  const [title, byline] = inference.title?.split('<by>') ?? [
    'A mysterious creation',
    'by no one (nothing)',
  ]
  const files = useQuery(api.files.images.getMany, { imageIds: fileContent.map((f) => f.imageId) })
  const fallback = [null, null, null, null]

  const images = files ?? fallback
  return (
    <div id="outer-layout" className="flex-col-center min-h-full p-4 sm:p-8 lg:h-full">
      <Card className="min-h-72">
        <div className={cn('flex h-full flex-col items-center', className)}>
          <div className="p-4">
            <Heading size={hSize.h1} align="center">
              {title}
            </Heading>
            <Heading size={hSize.h2} className="text-gray-11" align="center">
              {byline}
            </Heading>
          </div>

          <div className="flex grow flex-wrap justify-center overflow-hidden">
            {images?.map((image, i) => <MImage key={image?._id ?? i} image={image} />)}
          </div>
        </div>
      </Card>
    </div>
  )
}

const fallbackImgUrl = '/black-noise.png'

type MImageProps = {
  image?: Ent<'images'> | null
} & React.ComponentProps<'div'>

export const MImage = ({ image, ...props }: MImageProps) => {
  const width = image?.width ?? 512
  const height = image?.height ?? 512

  return (
    <div
      {...props}
      className={cn(
        width > height
          ? 'lg:max-h-[35vh] lg:max-w-[40%]'
          : height > width
            ? 'max-h-[60vh] lg:max-h-[80vh] lg:w-[23vw]'
            : 'max-h-[50vh] lg:max-h-[40vmin]',
        '',
      )}
      style={{ aspectRatio: width / height }}
    >
      <NextImage
        src={image?.storageUrl ?? fallbackImgUrl}
        alt=""
        width={width}
        height={height}
        blurDataURL={image?.blurDataURL}
        className="rounded-6 border-4 border-surface "
      />
    </div>
  )
}
