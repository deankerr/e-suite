'use client'

import { ImageModelCard } from '@/app/components/generations/ImageModelCard'
import { Generation as TGeneration } from '@/convex/generations/do'
import { cn } from '@/lib/utils'
import { Em, Heading, Separator, Strong } from '@radix-ui/themes'
import { FileImageIcon } from 'lucide-react'
import NextLink from 'next/link'
import { Button } from '../ui/Button'
import { Frame } from '../ui/Frame'
import { Shell } from '../ui/Shell'
import { DeleteGenerationDialog } from './DeleteGenerationDialog'

export const Generation = ({ generation }: { generation: TGeneration }) => {
  const creator = 'Fix.Me'

  // const portraitLayout = height > width && 'max-w-[33%]'
  // const squareLayout = height === width && 'max-w-[48%]'
  // const landscapeLayout = height < width && 'max-w-[49%]'

  // const isError = status === 'error' || status === 'failed'
  const isError = false
  const parameters = generation.images[0]!.parameters!
  return (
    <Shell.Root>
      <Shell.TitleBar icon={FileImageIcon}>{parameters.prompt}</Shell.TitleBar>

      <Shell.Content className="grid content-center">
        <div className={cn('flex h-full flex-wrap items-center justify-center gap-1')}>
          {generation.images.map((image) => (
            <img
              key={image._id}
              src={image.url ?? fallbackUrl}
              width={image.width / 3}
              height={image.height / 3}
              className="aspect-[2/3]"
            />
          ))}
          {/* {Array.from({ length: n }, (_, i) => (
            <Frame
              key={i}
              image={images[i]}
              frameWidth={width}
              frameHeight={height}
              alt={`generation result ${i}`}
              className={cn(
                'max-w-[50%] border border-bronze-6',
                portraitLayout,
                squareLayout,
                landscapeLayout,
              )}
              isError={isError}
            />
          ))} */}
        </div>
      </Shell.Content>

      <Shell.Controls>
        <Button asChild>
          <NextLink href={`/generations/${generation._id}`}>Link</NextLink>
        </Button>
        {/* <Button variant="outline">Copy</Button> */}
        <DeleteGenerationDialog id={generation._id}>
          <Button variant="outline" color="red">
            Delete
          </Button>
        </DeleteGenerationDialog>
      </Shell.Controls>

      <Shell.Sidebar className="px-rx-2">
        <div className="py-rx-4 text-center">
          <Em>&quot;created by&quot;</Em> <Strong>{creator ? `@${creator}` : 'anonymous'}</Strong>
        </div>
        <Separator size="4" />
        <div className="py-rx-4 text-sm">
          <Heading size="1">Prompt</Heading>
          <div>{parameters.prompt}</div>
        </div>
        <Separator size="4" />
        <div className="py-rx-4 text-sm">
          <Heading size="1">Negative prompt</Heading>
          <div>{parameters.negativePrompt || <i>blank</i>}</div>
        </div>
        <ImageModelCard fromId={parameters.imageModelId} className="mx-auto" />
        <div className="px-rx-1 py-rx-4">
          <table className="divide-y text-sm">
            <tbody>
              <tr>
                <td className="w-1/2 font-bold">Scheduler</td>
                <td>{parameters.scheduler}</td>
              </tr>
              <tr>
                <td className="font-bold">Guidance</td>
                <td>{parameters.guidance}</td>
              </tr>
              <tr>
                <td className="font-bold">LCM</td>
                <td>{parameters.lcm ? 'yes' : 'no'}</td>
              </tr>
              <tr>
                <td className="font-bold">Seed</td>
                <td>{parameters.seed ?? 'random'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="absolute bottom-0 right-1 text-right font-code text-[8px] text-gold-5">
          {/* status: {generation.status}
          <br /> */}
          {generation._id}
        </div>
      </Shell.Sidebar>
    </Shell.Root>
  )
}

const fallbackUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAJUlEQVR4nGP4+/fvt2/fGJYvX75p0yYGU1NTNzc3BhYWNktLCwDmfgwO/QBPIAAAAABJRU5ErkJggg=='
