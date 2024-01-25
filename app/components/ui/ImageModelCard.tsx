import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ImageModelResult } from '@/convex/types'
import { Badge, Button, Card, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ArrowUpRightSquare } from 'lucide-react'
import NextLink from 'next/link'
import { ImageC } from './ImageC'

type ImageModelCardProps = {
  imageModelId?: Id<'imageModels'>
} & React.ComponentProps<typeof Card>

export const ImageModelCard = ({ imageModelId, ...props }: ImageModelCardProps) => {
  const imageModel = useQuery(api.imageModels.get, imageModelId ? { id: imageModelId } : 'skip')

  return (
    <Card {...props}>
      <div className="grid grid-cols-[minmax(auto,40%)_1fr] gap-4">
        {imageModel && (
          <Inset side="left">
            <ImageC
              image={imageModel.images[0]}
              alt={`display image for model: ${imageModel.name}`}
              className="max-h-none rounded-r-none border-none"
            />
          </Inset>
        )}
        <div>
          {imageModel && (
            <>
              <div>{imageModel.name}</div>
              <ImageModelBadges imageModel={imageModel} />
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

const ImageModelBadges = ({ imageModel }: { imageModel: ImageModelResult }) => {
  const colors: Record<string, React.ComponentProps<typeof Badge>['color']> = {
    dalle2: 'grass',
    dalle3: 'jade',
    'sd1.5': 'purple',
    sdxl: 'crimson',
    unknown: 'red',
    CIVITAI: 'blue',
  }

  const baseName: Record<ImageModelResult['base'], string> = {
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
          >
            <span className="pr-1 pt-[1px]">
              CIVIT
              <span className="text-blue-9">AI</span>
            </span>
            <ArrowUpRightSquare size={15} />
          </NextLink>
        </Badge>
      )}
    </div>
  )
}
