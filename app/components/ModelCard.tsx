import { Badge, Card, Heading, Inset, Link, Text } from '@radix-ui/themes'
import Image from 'next/image'
import NextLink from 'next/link'
import 'lucide-react'

type ModelCardProps = {
  name: string
  imageUrl: string
  civitaiUrl?: string
  tags?: string[]
}

export const ModelCard = ({ name, imageUrl, civitaiUrl, tags }: ModelCardProps) => {
  return (
    <Card className="h-48">
      <div className="flex h-full">
        <div className="grow">
          <Heading size="3" className="text-balance">
            {name}
          </Heading>
          {civitaiUrl && (
            <NextLink href={civitaiUrl}>
              <Badge className="cursor-pointer">civit.ai</Badge>
            </NextLink>
          )}
          <div>
            <Text className="text-sm">{tags?.join(', ')}</Text>
          </div>
        </div>
        <Inset side="right" clip="border-box" className="relative w-5/12 shrink-0">
          <Image src={imageUrl} fill alt="model card image" style={{ objectFit: 'cover' }} />
        </Inset>
      </div>
    </Card>
  )
}
