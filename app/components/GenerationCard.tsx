/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { createElement } from 'react'
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
              'mx-auto grid w-fit grid-cols-4 place-content-center place-items-center gap-6 px-2 py-2 md:px-4',
              orientation === 'portrait' && 'lg:grid-cols-4',
            )}
          >
            {generation.status !== 'error' ? (
              [...new Array(n)].map((_, n) =>
                // <ImageFrame
                //   key={n + generation._id}
                //   className={cn(frameSizes[orientation], 'bg-red-4')}
                //   url={images[n]?.url}
                //   width={sizes[orientation][0]}
                //   height={sizes[orientation][1]}
                // />

                images[n] ? (
                  <HttpImageFrame
                    key={n}
                    image={images[n]!}
                    className={cn(frameSizes[orientation], 'rounded border-2 border-gold-9')}
                  />
                ) : (
                  <div
                    key={n}
                    className={cn(
                      'rounded border border-gold-5 bg-red-1A',
                      frameSizes[orientation],
                    )}
                  />
                ),
              )
            ) : (
              <div className="col-span-full">
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

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_API_URL!
const HttpImageFrame = ({ image, className }: { image: Image; className?: TailwindClass }) => {
  const url = new URL(`${convexSiteUrl}/image`)
  url.searchParams.set('storageId', image.storageId)
  const SvgPl = image.blurData?.svg ? createElement('svg', {}, image.blurData?.svg) : null
  return (
    <>
      <NextImage
        src={url.toString()}
        alt="http image"
        width={image.width / 2}
        height={image.height / 2}
        placeholder="blur"
        blurDataURL={image.blurData?.base64}
        className={cn('box-content rounded border border-gold-5', className)}
      />
      {/* <div className={cn(className, 'overflow-hidden')}>
        <img
          src={image.blurData?.base64}
          width={image.width / 2}
          height={image.height / 2}
          title={getSize(image.blurData?.base64)}
          className="box-content scale-105 rounded border border-gold-5 blur-2xl"
        />
        <div className="absolute left-0 top-0 text-lime-9">{getSize(image.blurData?.base64)}</div>
      </div>
      <div className={cn(className, 'overflow-hidden')}>
        <div
          className={cn(className, '')}
          style={{ backgroundColor: image.blurData?.color.hex }}
        ></div>
      </div> */}
    </>
  )
}

type SvgPProps = {
  svg?: any[]
}

export const SvgP = ({ svg }: SvgPProps) => {
  if (!svg) return null

  return createElement(
    svg[0],
    {
      ...svg[1],
      style: {
        ...svg[1].style,
        transform: ['scale(1)', svg[1].style.transform].join(' '),
        filter: 'blur(40px)',
      },
      className: '',
    },
    // @ts-expect-error nonono
    svg[2].map((child) =>
      createElement(child[0], {
        key: [child[1].x, child[1].y].join(','),
        ...child[1],
      }),
    ),
  )
}

const getSize = (v: unknown) => String(JSON.stringify(v)?.length)
