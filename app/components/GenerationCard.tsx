import { Doc } from '@/convex/_generated/dataModel'
import type { Generation, Image, ImageModel, ImageModelProvider } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Button, Card, Em, Heading, Inset, Separator } from '@radix-ui/themes'
import NextImage from 'next/image'
import * as R from 'remeda'
import { ImageModelCard } from './ImageModelCard'

type GenerationCardProps = {
  generation: Generation
  images: (Image | null)[]
  imageModel: Doc<'imageModels'> | null
  imageModelProvider: ImageModelProvider | null
}

export const GenerationCard = ({
  generation,
  images,
  imageModel,
  imageModelProvider,
}: GenerationCardProps) => {
  const { width, height, n } = generation
  const aspectRatio = width / height
  const orientation = aspectRatio === 1 ? 'square' : aspectRatio < 1 ? 'portrait' : 'landscape'

  const sizes = {
    square: [256, 256],
    portrait: [256, 384],
    landscape: [384, 256],
  } as const

  const frameSizes = {
    square: 'w-64 h-64',
    portrait: 'w-[256px] h-[384px]',
    landscape: 'w-96 h-64',
  }

  const frames = R.times(n, (n) => {
    const image = images[n]
    const source = image?.source
    const url = source?.url

    return (
      <div
        key={images[n]?._id ?? `placeholder-${n}`}
        className={cn(
          'grid place-content-center overflow-hidden rounded border border-gold-5',
          // frameSizes[orientation],
        )}
      >
        <Inset>
          {source && url ? (
            <NextImage
              src={url}
              alt={`generated image ${n}`}
              width={sizes[orientation][0]}
              height={sizes[orientation][1]}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            'noimg'
          )}
        </Inset>
      </div>
    )
  })

  return (
    <Card className="w-full max-w-6xl">
      <div className="relative flex">
        {/* <div className="absolute left-1 top-1 text-xs text-gold-5">{generation._id}</div> */}
        <div className="grow">
          <Inset side="top" className="h-10 rounded-none border-b border-gray-6 bg-gray-1">
            <div className=""></div>
          </Inset>
          <div
            className={cn(
              'grid gap-2 px-4 py-4',
              orientation === 'portrait' ? 'grid-cols-4' : 'grid-cols-2',
            )}
          >
            {frames}
          </div>
        </div>
        <Inset
          side="right"
          className="w-60 flex-none divide-y divide-gray-6 rounded-none border-l border-gray-6 bg-gray-1"
        >
          <div className="flex items-center justify-center gap-4 px-4 py-2">
            <Button size="1" variant="soft">
              Share
            </Button>
            <Button size="1" variant="soft">
              Copy
            </Button>
            <Button size="1" variant="soft" color="red">
              Delete
            </Button>
          </div>
          <div className="space-y-3 px-4 py-4">
            {/* <div className="border border-gray-6 bg-gray-3 text-sm">{imageModel?.name}</div> */}
            <ImageModelCard imageModel={imageModel} showImage={false} />

            <div className="">
              <Heading size="1">Prompt</Heading>
              <div className="text-sm">{generation.prompt}</div>
            </div>

            <Separator size="4" />

            <div className="">
              <Heading size="1">Negative prompt</Heading>
              <div className="text-sm">{generation.negativePrompt || <i>blank</i>}</div>
            </div>

            <Separator size="4" />
          </div>
        </Inset>
      </div>
    </Card>
  )
}

/* 
  <div
            key={image._id}
            className="grid h-[384px] w-[256px] place-content-center rounded border border-accent-4"
          >
            <Inset>
              <NextImage
                src={image}
                alt="generation"
                width="256"
                height="384"
                className="object-cover object-center"
              />
            </Inset>
          </div>
*/
