import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ImageModelResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Badge, Card, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ArrowUpRightSquare } from 'lucide-react'
import NextLink from 'next/link'
import { Frame } from './Frame'

type ImageModelCardProps = {
  imageModelId?: Id<'imageModels'>
  from?: ImageModelResult
} & React.ComponentProps<typeof Card>

export const ImageModelCard = ({
  imageModelId,
  from,
  className,
  ...props
}: ImageModelCardProps) => {
  const query = useQuery(api.imageModels.get, imageModelId ? { id: imageModelId } : 'skip')
  const result = from ?? query

  const imageModel = result?.imageModel
  const image = result?.image
  return (
    <Card className={cn('after:card-border-[amber-8] h-36 w-80', className)} {...props}>
      <div className="grid h-full grid-cols-[minmax(auto,40%)_1fr] gap-4">
        <Inset side="all" className="bg-accent-1A">
          <Frame image={image} alt={`cover image from model: ${imageModel?.name}`} />
        </Inset>

        <div>
          <div className="text-sm">{imageModel?.name}</div>
          {imageModel && <ImageModelBadges imageModel={imageModel} />}
        </div>
      </div>

      <div className="absolute bottom-0 right-1 w-fit text-right font-code text-[8px] text-gold-6">
        <div>order: {imageModel?.order}</div>
        {imageModel?._id}
      </div>
    </Card>
  )
}

const ImageModelBadges = ({ imageModel }: { imageModel: ImageModelResult['imageModel'] }) => {
  const colors: Record<string, React.ComponentProps<typeof Badge>['color']> = {
    dalle2: 'grass',
    dalle3: 'jade',
    'sd1.5': 'purple',
    sdxl: 'crimson',
    unknown: 'red',
    CIVITAI: 'blue',
  }

  const baseName: Record<ImageModelResult['imageModel']['base'], string> = {
    dalle2: 'DALL-E 2',
    dalle3: 'DALL-E 3',
    'sd1.5': 'Stable Diffusion 1.5',
    sdxl: 'Stable Diffusion XL',
    unknown: 'unknown',
  }

  return (
    <div className="flex flex-wrap gap-1 py-1">
      <Badge color={colors[imageModel.base]}>{baseName[imageModel.base]}</Badge>
      <Badge>{imageModel.type}</Badge>
      {imageModel.civitaiId && (
        <Badge className="cursor-pointer" color="blue" variant="soft">
          <NextLink
            href={`https://civitai.com/models/${imageModel.civitaiId}`}
            className="inline-flex w-full items-center justify-between"
            target="_blank"
          >
            <span className="pr-1 pt-[1px]">
              CIVIT
              <span className="text-blue-9">AI</span>
            </span>
            <ArrowUpRightSquare size={15} />
          </NextLink>
        </Badge>
      )}
      {imageModel.huggingFaceId && (
        <Badge color="yellow" className="cursor-pointer">
          <NextLink
            href={`https://huggingface.co/${imageModel.huggingFaceId}`}
            className="inline-flex w-full items-center justify-between"
            target="_blank"
          >
            <span className="">huggingface</span> <ArrowUpRightSquare size={15} />
          </NextLink>
        </Badge>
      )}
    </div>
  )
}
