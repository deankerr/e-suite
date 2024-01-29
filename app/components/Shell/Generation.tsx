import { GenerationResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Button, Em, Heading, Separator, Strong } from '@radix-ui/themes'
import { FileImageIcon } from 'lucide-react'
import { DeleteGenerationDialog } from '../ui/DeleteGenerationDialog'
import { Frame } from '../ui/Frame'
import { ImageModelCard } from '../ui/ImageModelCard'
import { Shell } from './Shell'

export const Generation = ({ author, generation, images, imageModel }: GenerationResult) => {
  const { width, height, n, status } = generation
  const creator = author?.username

  const portraitLayout = height > width && 'md:grid-cols-4'
  const squareLayout = height === width && 'max-w-[calc(384px_*_2)]'
  const landscapeLayout = height < width && 'max-w-[calc(384px_*_2.5)]'

  const isError = status === 'error' || status === 'failed'

  return (
    <Shell.Root className="">
      <Shell.TitleBar icon={FileImageIcon}>{generation.prompt}</Shell.TitleBar>

      <Shell.Content>
        <div
          className={cn(
            'mx-auto grid h-full w-full grid-cols-2 place-content-center gap-rx-1',
            portraitLayout,
            squareLayout,
            landscapeLayout,
          )}
        >
          {Array.from({ length: n }, (_, i) => (
            <Frame
              key={i}
              image={images[i]}
              frameWidth={width}
              frameHeight={height}
              alt={`generation result ${i}`}
              className="border border-bronze-6"
              isError={isError}
            />
          ))}
        </div>
      </Shell.Content>

      <Shell.Controls>
        <Button variant="outline">Link</Button>
        <Button variant="outline">Copy</Button>
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

        <ImageModelCard imageModelId={imageModel?._id} className="mx-auto w-72" />

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
