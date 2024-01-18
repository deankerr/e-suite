import { Doc } from '@/convex/_generated/dataModel'
import type { Generation, Image, ImageModel, ImageModelProvider } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Button, Card, Em, Heading, IconButton, Inset, Separator } from '@radix-ui/themes'
import { FileImageIcon } from 'lucide-react'
import NextImage from 'next/image'
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

  return (
    <Card className="container mx-auto">
      <Inset>
        <div className="grid h-full grid-flow-row md:grid-flow-col md:grid-cols-[auto_24%] md:grid-rows-[4rem_36rem]">
          {/* header */}
          <div className="flex items-center gap-3 border-b bg-gray-1 px-3 py-2 text-gray-12">
            <IconButton variant="ghost" size="3">
              <FileImageIcon className="size-6 text-accent-10" />
            </IconButton>
            <Heading size={{ initial: '4', md: '5' }} className="text-wrap">
              {generation.prompt}
            </Heading>
          </div>

          {/* content */}
          <div
            className={cn(
              'mx-auto grid w-fit grid-cols-2 place-content-center place-items-center gap-2 px-2 py-2 md:px-4',
              orientation === 'portrait' && 'md:grid-cols-4',
            )}
          >
            {[...new Array(n)].map((_, n) => (
              <ImageFrame
                key={n}
                className={cn(frameSizes[orientation], 'bg-red-4')}
                url={images[n]?.source?.url}
                width={sizes[orientation][0]}
                height={sizes[orientation][1]}
              />
            ))}
          </div>

          {/* sidebar header */}
          <div className="flex items-center justify-evenly gap-4 border-b border-l bg-gray-1 px-4 py-2">
            <Button size="2" variant="surface">
              Share
            </Button>
            <Button size="2" variant="outline">
              Copy
            </Button>
            <Button size="2" variant="surface" color="red">
              Delete
            </Button>
          </div>

          {/* sidebar content */}
          <div className="space-y-5 border-l bg-gray-1 px-4 py-4 pt-6">
            <ImageModelCard imageModel={imageModel} showImage={false} />

            <div className="">
              <Heading size="1">Prompt</Heading>
              <div>{generation.prompt}</div>
            </div>

            <Separator size="4" />

            <div className="">
              <Heading size="1">Negative prompt</Heading>
              <div>{generation.negativePrompt || <i>blank</i>}</div>
            </div>

            <Separator size="4" />

            <table className="divide-y text-sm [&_td]:px-1">
              <tr>
                <td className="w-1/2 font-bold">Scheduler</td>
                <td>{generation.scheduler}</td>
              </tr>
              <tr>
                <td className="font-bold">Guidance</td>
                <td>{generation.guidance}</td>
              </tr>
              <tr>
                <td className="font-bold">LCM</td>
                <td>{generation.lcm ? 'yes' : 'no'}</td>
              </tr>
              <tr>
                <td className="font-bold">Seed</td>
                <td>{generation.seed ?? 'random'}</td>
              </tr>
            </table>

            <div className="absolute bottom-0 right-1 text-right font-code text-[8px] text-gold-5">
              status: {generation.status}
              <br />
              {generation._id}
            </div>
          </div>
        </div>
      </Inset>
    </Card>
  )
}

type ImageFrameProps = {
  width: number
  height: number
  url?: string | null
} & React.ComponentProps<'div'>

const ImageFrame = ({ className, url, width, height }: ImageFrameProps) => {
  return url ? (
    <NextImage
      src={url}
      alt={`generated image`}
      width={width}
      height={height}
      className="box-content rounded border border-gold-5"
    />
  ) : (
    <div className={cn('rounded border border-gold-5 bg-red-4', className)} />
  )
}
