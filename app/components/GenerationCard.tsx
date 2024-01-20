import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import type { Generation, Image, ImageModel, ImageModelProvider } from '@/convex/types'
import { cn } from '@/lib/utils'
import {
  Button,
  Card,
  Dialog,
  Em,
  Heading,
  IconButton,
  Inset,
  Separator,
  Strong,
  Text,
} from '@radix-ui/themes'
import { useMutation } from 'convex/react'
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
        <div className="grid h-full grid-flow-row md:grid-flow-col md:grid-cols-[1fr_18rem] md:grid-rows-[3rem_auto]">
          {/* header */}
          <div className="flex items-center gap-2 border-b bg-gray-1 px-2 py-2 text-gray-12">
            <IconButton variant="ghost" size="2">
              <FileImageIcon className="size-5" strokeWidth={1} />
            </IconButton>
            {generation.prompt}
          </div>

          {/* content */}
          <div
            className={cn(
              'mx-auto grid w-fit grid-cols-2 place-content-center place-items-center gap-2 px-2 py-2 md:px-4',
              orientation === 'portrait' && 'lg:grid-cols-4',
            )}
          >
            {[...new Array(n)].map((_, n) => (
              <ImageFrame
                key={n + generation._id}
                className={cn(frameSizes[orientation], 'bg-red-4')}
                url={images[n]?.url}
                width={sizes[orientation][0]}
                height={sizes[orientation][1]}
              />
            ))}
          </div>

          {/* sidebar header */}
          <div className="flex items-center justify-center gap-2 border-b border-l bg-gray-1 px-4 py-2">
            <Button size="2" variant="surface">
              Share
            </Button>
            <Button size="2" variant="outline">
              Copy
            </Button>
            <DeleteDialog generationId={generation._id}>
              <Button size="2" variant="surface" color="red">
                Delete
              </Button>
            </DeleteDialog>
          </div>

          {/* sidebar content */}
          <div className="space-y-5 border-l bg-gray-1 px-4 py-4 pt-6">
            {/* //^ id = temp workaround for image */}
            <ImageModelCard imageModel={imageModel} id={imageModel?._id} className="h-30" />

            <div className="text-sm">
              <Heading size="1">Prompt</Heading>
              <div>{generation.prompt}</div>
            </div>

            <Separator size="4" />

            <div className="text-sm">
              <Heading size="1">Negative prompt</Heading>
              <div>{generation.negativePrompt || <i>blank</i>}</div>
            </div>

            <Separator size="4" />

            <table className="divide-y text-sm [&_td]:px-1">
              <tbody>
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
              </tbody>
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

type DeleteDialogProps = {
  children: React.ReactNode
  generationId: Id<'generations'>
}

const DeleteDialog = ({ children, generationId }: DeleteDialogProps) => {
  const destroy = useMutation(api.generations.destroy)
  const handleClick = async () => {
    await destroy({ id: generationId })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Destroy generation</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Delete generation and images
        </Dialog.Description>

        <div className="flex justify-end gap-3">
          <Dialog.Close>
            <Button color="gray" variant="soft">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button color="red" variant="solid" onClick={() => void handleClick()}>
              Destroy
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
