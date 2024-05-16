import Image from 'next/image'

import type { EImage } from '@/convex/external'

type ImageCardProps = { image: EImage }

export const ImageCard = ({ image }: ImageCardProps) => {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ aspectRatio: image.width / image.height, width: image.width, maxWidth: '100%' }}
    >
      <Image
        src={`/i/${image._id}.webp`}
        width={image.width}
        height={image.height}
        placeholder={image.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image.blurDataUrl}
        className={'h-full w-full object-cover'}
        alt="generated image"
      />
    </div>
  )
}
