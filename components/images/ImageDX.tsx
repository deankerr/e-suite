'use client'

import { useRef, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, IconButton } from '@radix-ui/themes'

import { EImageLoader } from '@/components/images/EImageLoader'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const ImageDX = ({
  image,
  className,
  ...props
}: { image: EImage } & React.ComponentProps<typeof Card>) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const currentSrc = snipUrl(imageRef.current?.currentSrc || '')
  const currentSize = imageRef.current?.naturalWidth
    ? `${imageRef.current.naturalWidth}x${imageRef.current.naturalHeight}`
    : ''

  const { caption, nsfwProbability } = image

  const [expandCaptionCard, setExpandCaptionCard] = useState(false)

  return (
    <Card {...props} className={cn('', className)}>
      <EImageLoader ref={imageRef} image={image} sizes="33vw" />

      <div className="absolute right-1 top-1">
        <IconButton
          size="2"
          variant="soft"
          color="gray"
          radius="full"
          className="backdrop-blur"
          onClick={() => setExpandCaptionCard(!expandCaptionCard)}
        >
          <Icons.DotsThreeCircle weight="regular" className="size-8 text-white/90" />
        </IconButton>
      </div>

      {/* debug info */}
      <div className="absolute right-2 top-2 hidden border bg-overlay p-1 font-mono text-xs font-medium">
        {currentSrc} {currentSize} {image.width}x{image.height}
      </div>

      {/* caption card */}
      <Card
        size="1"
        className={cn(
          'absolute inset-x-1 bottom-1 flex max-h-[75%] flex-col overflow-hidden text-sm opacity-30 backdrop-blur-3xl [--card-background-color:#00000080]',
          !expandCaptionCard && 'h-11',
        )}
      >
        <div className={cn('h-full overflow-y-auto pb-1', !expandCaptionCard && 'overflow-hidden')}>
          {caption?.text}
        </div>
        <div
          className={cn(
            'flex justify-between gap-2 border-t border-grayA-3 pt-2 font-mono text-xs text-gray-11',
            !expandCaptionCard && 'hidden',
          )}
        >
          <div className="truncate">{caption?.modelId}</div>
          {nsfwProbability ? (
            <div className="shrink-0">{`NSFW: ${Math.round(nsfwProbability * 100)}%`}</div>
          ) : null}
        </div>
      </Card>
    </Card>
  )
}

const snipUrl = (url: string) => {
  const match = url.match(/\.([a-z0-9]+)(\?.*)?$/i)
  return match ? match[0] : ''
}
