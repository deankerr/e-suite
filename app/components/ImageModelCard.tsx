import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import type { ImageModel, ModelType } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Badge, Card, colorProp, Heading, Inset, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ArrowUpRightSquare } from 'lucide-react'
import NextImage from 'next/image'
import NextLink from 'next/link'

type ImageModelCardProps = {
  id?: Id<'imageModels'>
  imageModel?: ImageModel | null | undefined
} & React.ComponentProps<typeof Card>

export const ImageModelCard = ({ className, id, imageModel, ...props }: ImageModelCardProps) => {
  const gm = useQuery(api.imageModels.get, id ? { id } : 'skip')
  const m = imageModel ?? gm
  if (m === null) return <Card className="h-36 flex-none">null</Card>

  const url = m?.images ? m.images[0]?.source?.url : undefined

  return (
    <Card className={cn('h-36 flex-none', className)} {...props}>
      <div className="flex h-full">
        <Inset
          side="left"
          clip="border-box"
          className="relative w-5/12 shrink-0 border-r border-gray-5"
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
        <div className="relative grow pl-rx-3">
          <Heading size="2" className="text-balance">
            {m?.name ?? <Skeleton className="h-[var(--heading-line-height-2)]" />}
          </Heading>

          <BaseModelBadge base={m?.base} />
          <CivitaiIdLinkBadge civitaiId={m?.civitaiId} />
          <ModelTypeBadge type={m?.type} />

          {/* <div>
            <Text className="text-sm">{tags?.join(', ')}</Text>
          </div> */}
          <Text className="absolute -bottom-2 left-3 font-code text-[8px] text-gold-5">
            {m?._id}
          </Text>
        </div>
      </div>
    </Card>
  )
}

type BaseModelBadgeProps = {
  base: ImageModel['base'] | undefined
}
const BaseModelBadge = ({ base }: BaseModelBadgeProps) => {
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

type ModelTypeBadgeProps = {
  type?: ModelType
}
const ModelTypeBadge = ({ type }: ModelTypeBadgeProps) => {
  if (!type) return null

  return <Badge>{type}</Badge>
}

type CivitaiIdLinkBadgeProps = {
  civitaiId?: string | null
}
const CivitaiIdLinkBadge = ({ civitaiId }: CivitaiIdLinkBadgeProps) => {
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
