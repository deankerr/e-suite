import { Card, Inset } from '@radix-ui/themes'
import Image from 'next/image'

type GenerationCardProps = {
  imageUrls?: string[]
}

export const GenerationCard = ({ imageUrls }: GenerationCardProps) => {
  return (
    <Card>
      <div className="flex gap-6 px-4 py-2">
        {imageUrls?.map((url) => (
          <div
            key={url}
            className="grid h-[384px] w-[256px] place-content-center rounded border border-accent-4"
          >
            <Inset>
              <Image
                src={url}
                alt="generation"
                width="256"
                height="384"
                className="object-cover object-center"
              />
            </Inset>
          </div>
        ))}
      </div>
    </Card>
  )
}
