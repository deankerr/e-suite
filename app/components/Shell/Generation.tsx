import { GenerationResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Button, Em, Heading, Separator, Strong } from '@radix-ui/themes'
import { FileImageIcon } from 'lucide-react'

import { ImageC } from '../ui/ImageC'
import { Shell } from './Shell'
import { ImageModelCard } from '../ui/ImageModelCard'

export const Generation = ({ author, generation, images, imageModel }: GenerationResult) => {
  const { width, height, n } = generation
  const creator = author?.info.nickname
  const layout =
    width > height
      ? '' // landscape
      : height > width
        ? 'md:grid-cols-4' // portrait
        : 'grid-cols-2' // square
  return (
    <Shell.Root className="">
      <Shell.TitleBar icon={FileImageIcon}>{generation.prompt}</Shell.TitleBar>

      <Shell.Content>
        <div
          className={cn(
            'mx-auto grid h-full w-fit grid-cols-2 place-content-center items-center gap-rx-1',
            layout,
          )}
        >
          {Array.from({ length: n }, (_, i) => (
            <ImageC
              key={i}
              image={images[i]}
              width={width}
              height={height}
              alt={`generation result ${i}`}
            />
          ))}
        </div>
      </Shell.Content>

      <Shell.Controls>
        <Button variant="outline">Link</Button>
        <Button variant="outline">Copy</Button>
        <Button variant="outline" color="red">
          Delete
        </Button>
      </Shell.Controls>

      <Shell.Sidebar className="px-rx-2">
        <div className="py-rx-4 text-center">
          <Em>&quot;created by&quot;</Em> <Strong>{creator ? `@${creator}` : 'anonymous'}</Strong>
        </div>

        <ImageModelCard imageModelId={imageModel?._id} className="mx-auto" />

        <div className="py-rx-4 text-sm">
          <Heading size="1">Prompt</Heading>
          <div>{generation.prompt}</div>
        </div>

        <Separator size="4" />

        <div className="py-rx-4 text-sm">
          <Heading size="1">Negative prompt</Heading>
          <div>{generation.negativePrompt || <i>blank</i>}</div>
        </div>

        <Separator size="4" />

        <div className="px-rx-1 py-rx-4">
          <table className="divide-y text-sm">
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
        </div>

        <div className="absolute bottom-0 right-1 text-right font-code text-[8px] text-gold-5">
          status: {generation.status}
          <br />
          {generation._id}
        </div>
      </Shell.Sidebar>
    </Shell.Root>
  )
}
