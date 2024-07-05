import { Card } from '@radix-ui/themes'
import NextImage from 'next/image'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const Image = ({
  image,
  sizes,
  alt = '',
  className,
  ...props
}: { image: EImage; alt?: string; sizes?: string } & React.ComponentPropsWithoutRef<'div'>) => {
  const caption = image.caption
  const nsfwProbability = image.nsfwProbability

  return (
    <div className="space-y-2">
      <div
        style={{ aspectRatio: image.width / image.height, width: image.width, maxWidth: '100%' }}
        {...props}
        className={cn('overflow-hidden rounded-xl', className)}
      >
        <NextImage
          src={`/i/${image._id}.webp`}
          width={image.width}
          height={image.height}
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={image.blurDataUrl}
          className={'h-full w-full object-cover'}
          sizes={sizes}
          alt={alt}
        />
      </div>

      {(caption || nsfwProbability) && (
        <Card size="1">
          <div className="max-h-32 overflow-y-auto pb-1">
            {caption?.text ? caption.text : <LoadingSpinner variant="dots" className="w-4" />}
          </div>
          <div className="border-t border-grayA-3 pt-1 font-mono text-xs text-gray-11 flex-between">
            {caption?.modelId}
            <span>{nsfwProbability ? `NSFW: ${Math.round(nsfwProbability * 100)}%` : null}</span>
          </div>
        </Card>
      )}
    </div>
  )
}
