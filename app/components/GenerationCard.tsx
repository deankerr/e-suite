import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import type { Generation, Image as ImageDoc, ImageModelProvider } from '@/convex/types'
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
} from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { FileImageIcon } from 'lucide-react'
import { ImageModelCard } from './ImageModelCard'
import { ImageC } from './ui/Image'

const imageSizes = {
  square: { width: 320, height: 320 },
  portrait: { width: 256, height: 384 },
  landscape: { width: 384, height: 256 },
} as const

type GenerationCardProps = {
  generation: Generation
  images: (ImageDoc | null)[]
  imageModel: Doc<'imageModels'> | null
  imageModelProvider: ImageModelProvider | null
  author?: Doc<'users'> | null
}

type ImageShape = 'square' | 'portrait' | 'landscape'
const getShape = (width: number, height: number): ImageShape => {
  const ratio = width / height
  if (ratio === 1) return 'square' as const
  if (ratio < 1) return 'portrait'
  return 'landscape'
}

export const GenerationCard = ({ generation, images, imageModel, author }: GenerationCardProps) => {
  const { width, height, n, status } = generation

  const shape = getShape(width, height)
  const size = imageSizes[shape]

  const frames = Array.from({ length: n }, (_, i) => ({ image: images[i], size }))
  const isLoading = status === 'pending' || status === 'acting'

  const authorName = author ? author.info?.nickname ?? author.info?.givenName : null
  return (
    <Card className="container mx-auto">
      <Inset>
        <div className="grid h-full grid-flow-row md:grid-flow-col md:grid-cols-[1fr_20rem] md:grid-rows-[3rem_auto]">
          {/* header */}
          <div className="flex items-center gap-2 border-b bg-gray-1 px-2 py-2 text-gray-12">
            <IconButton variant="ghost" size="2">
              <FileImageIcon className="size-5" strokeWidth={1} />
            </IconButton>
            {generation.prompt}
          </div>

          {/* content */}
          <div
            className={cn('mx-auto grid grid-cols-2 place-items-center gap-6 px-2 py-2 md:px-4')}
          >
            {frames.map((frame, i) => (
              <ImageC
                key={frame.image?._id ?? i}
                {...frame}
                alt={`generated image ${i}`}
                isLoading={isLoading}
              />
            ))}

            {status === 'error' && (
              <div className="absolute grid place-content-center rounded text-2xl text-red-10">
                error: {generation.events.findLast((ev) => ev.status === 'error')?.message}
              </div>
            )}
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
            <div className="flex justify-center gap-2">
              <Em>{`"created by"`}</Em>
              {authorName ? <Strong>@{authorName}</Strong> : <Em>anonymous</Em>}
            </div>

            <Separator size="4" />

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
