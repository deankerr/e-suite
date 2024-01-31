import { ImageModelResult } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Badge, Card, Inset } from '@radix-ui/themes'
import { ArrowUpRightSquare } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { Frame } from '../ui/Frame'

type Props = {
  from?: ImageModelResult | null
}

export const ImageModelCard = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ImageModelSlate({ from, className, ...props }, forwardedRef) {
    if (!from) return null

    const { imageModel, image } = from
    return (
      <Card {...props} className={cn('h-32 w-72', className)} ref={forwardedRef}>
        <Inset side="x" className="absolute left-[65%] top-0 w-32">
          <Frame image={image} alt={`cover image from model: ${imageModel?.name}`} />
        </Inset>

        <div className="flex h-full max-w-[65%] flex-col space-y-1 text-sm">
          {imageModel?.name}

          <div className="flex flex-wrap gap-1 py-1">
            {imageModel && <ImageModelBadges imageModel={imageModel} />}
          </div>
        </div>

        <div className="absolute bottom-0 left-3 w-fit font-code text-[8px] text-gold-6">
          {imageModel?._id}
        </div>
      </Card>
    )
  },
)

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
    <>
      <Badge className="h-fit" color={colors[imageModel.base]}>
        {baseName[imageModel.base]}
      </Badge>
      <Badge className="h-fit">{imageModel.type}</Badge>
      {imageModel.civitaiId && (
        <Badge className="h-fit cursor-pointer" color="blue" variant="soft">
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
        <Badge color="yellow" className="h-fit cursor-pointer">
          <NextLink
            href={`https://huggingface.co/${imageModel.huggingFaceId}`}
            className="inline-flex w-full items-center justify-between"
            target="_blank"
          >
            <span className="">huggingface</span> <ArrowUpRightSquare size={15} />
          </NextLink>
        </Badge>
      )}
    </>
  )
}
