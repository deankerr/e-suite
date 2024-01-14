import type { Image, ImageModel } from '@/convex/types'
import { Badge, Card, Heading, Inset, Text } from '@radix-ui/themes'
import { ArrowUpRightSquare } from 'lucide-react'
import NextImage from 'next/image'
import NextLink from 'next/link'

type ImageModelCardProps = {
  imageModel: ImageModel & { images: Image[] }
}

export const ImageModelCard = ({ imageModel }: ImageModelCardProps) => {
  const { name, images, civitaiId, tags, base } = imageModel
  const url = images[0]?.source?.url
  const baseBadge = baseModelBadges[base] ?? null

  return (
    <Card className="h-40">
      <div className="flex h-full">
        <Inset side="left" clip="border-box" className="relative w-6/12 shrink-0">
          {url ? (
            <NextImage src={url} fill alt="model card image" style={{ objectFit: 'cover' }} />
          ) : (
            `!url: ${url}`
          )}
        </Inset>
        <div className="grow pl-6">
          <Heading size="2" className="mr-2 inline-block text-balance">
            {name}
          </Heading>

          {baseBadge}

          {civitaiId && (
            <Badge className="mr-2 cursor-pointer" color="blue" variant="soft">
              <NextLink
                href={`https://civitai.com/models/${civitaiId}`}
                className="inline-flex w-full items-center justify-between"
              >
                <span className="pr-1 pt-[1px] text-blue-11">
                  CIVIT
                  <span className="text-gray-11">AI</span>
                </span>
                <ArrowUpRightSquare size={15} />
              </NextLink>
            </Badge>
          )}

          <div>
            <Text className="text-sm">{tags?.join(', ')}</Text>
          </div>
        </div>
      </div>
    </Card>
  )
}

const baseModelBadges = {
  'sd1.5': <Badge color="purple">Stable Diffusion 1.5</Badge>,
  sdxl: <Badge color="crimson">Stable Diffusion XL</Badge>,
  dalle2: <Badge color="grass">DALL·E 2</Badge>,
  dalle3: <Badge color="jade">DALL·E 3</Badge>,
  unknown: <Badge color="red">Unknown</Badge>,
} as const
