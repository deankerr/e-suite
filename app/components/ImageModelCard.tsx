import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import type { ImageModel, ModelType } from '@/convex/types'
import { cn } from '@/lib/utils'
import {
  Badge,
  Button,
  Card,
  colorProp,
  Heading,
  IconButton,
  Inset,
  Skeleton,
  Text,
} from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ArrowUpRightSquare } from 'lucide-react'
import NextImage from 'next/image'
import NextLink from 'next/link'

type ImageModelCardProps = {
  id?: Id<'imageModels'>
  imageModel?: ImageModel | null | undefined
  buttonSash?: React.ReactNode
  showImage?: boolean
} & React.ComponentProps<typeof Card>

export const ImageModelCard = ({
  className,
  id,
  imageModel,
  buttonSash,
  showImage = true,
  ...props
}: ImageModelCardProps) => {
  const modelById = useQuery(api.imageModels.get, id ? { id } : 'skip')
  const m = imageModel ?? modelById
  if (m === null) return <Card className="h-36 flex-none">null</Card>

  const url = m?.images ? m.images[0]?.source?.url : undefined

  return (
    <Card className={cn('relative flex-none', showImage ? 'h-36' : 'h-24', className)} {...props}>
      <div className="flex h-full">
        <Inset
          side="left"
          clip="border-box"
          className={cn('relative w-5/12 shrink-0 border-r border-gray-5', !showImage && 'hidden')}
        >
          {url ? (
            <NextImage
              src={url}
              sizes="(max-width: 1200px) 130px"
              fill
              alt="model card image"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <Skeleton className="h-full" />
          )}
        </Inset>

        <div className={cn('relative grow', showImage && 'pl-rx-3')}>
          <Heading size="2" className="text-balance">
            {m?.name ?? <Skeleton className="h-[var(--heading-line-height-2)]" />}
          </Heading>

          <BaseModelBadge base={m?.base} />
          <CivitaiIdLinkBadge civitaiId={m?.civitaiId} />
          <ModelTypeBadge type={m?.type} />

          <div className="absolute -bottom-2 -ml-rx-4 w-full text-center font-code text-[8px] text-gold-5">
            {m?._id}
          </div>
        </div>
      </div>

      {buttonSash && (
        <Button className="absolute inset-0 h-full cursor-pointer" variant="ghost" color="gold">
          <div className="ml-auto flex h-full items-center bg-accent-2A">{buttonSash}</div>
        </Button>
      )}
    </Card>
  )
}

const BaseModelBadge = ({ base }: { base?: ImageModel['base'] }) => {
  if (!base) return null

  const baseColors: Record<ImageModel['base'], (typeof colorProp.values)[number]> = {
    dalle2: 'grass',
    dalle3: 'jade',
    'sd1.5': 'purple',
    sdxl: 'crimson',
    unknown: 'red',
  }

  const baseName: Record<ImageModel['base'], string> = {
    dalle2: 'DALL-E 2',
    dalle3: 'DALL-E 3',
    'sd1.5': 'StableDiffusion 1.5',
    sdxl: 'StableDiffusion XL',
    unknown: 'unknown',
  }

  return <Badge color={baseColors[base]}>{baseName[base]}</Badge>
}

const ModelTypeBadge = ({ type }: { type?: ModelType }) => {
  if (!type) return null
  return <Badge>{type}</Badge>
}

const CivitaiIdLinkBadge = ({ civitaiId }: { civitaiId?: string | null }) => {
  if (!civitaiId) return null

  return (
    <Badge className="mr-2 cursor-pointer" color="blue" variant="soft">
      <NextLink
        href={`https://civitai.com/models/${civitaiId}`}
        className="inline-flex w-full items-center justify-between"
      >
        <span className="pr-1 pt-[1px]">
          CIVIT
          <span className="text-blue-9">AI</span>
        </span>
        <ArrowUpRightSquare size={15} />
      </NextLink>
    </Badge>
  )
}
