import { Badge, Card, Heading, Inset, Text } from '@radix-ui/themes'
import NextImage from 'next/image'
import NextLink from 'next/link'
import 'lucide-react'
import { Image } from '@/convex/types'

type ModelCardProps = {
  name: string
  images: Image[]
  civitaiId: string | null
  tags?: string[]
}

export const ModelCard = ({ name, images, civitaiId, tags }: ModelCardProps) => {
  const url = images[0]?.source?.url
  return (
    <Card className="h-48">
      <div className="flex h-full">
        <div className="grow">
          <Heading size="3" className="text-balance">
            {name}
          </Heading>
          {civitaiId && (
            <NextLink href={`https://civitai.com/models/${civitaiId}`}>
              <Badge className="cursor-pointer">civit.ai</Badge>
            </NextLink>
          )}
          <div>
            <Text className="text-sm">{tags?.join(', ')}</Text>
          </div>
        </div>
        <Inset side="right" clip="border-box" className="relative w-5/12 shrink-0">
          {url ? (
            <NextImage src={url} fill alt="model card image" style={{ objectFit: 'cover' }} />
          ) : (
            `!url: ${url}`
          )}
        </Inset>
      </div>
    </Card>
  )
}
