'use client'

import { useRef } from 'react'
import { Card } from '@radix-ui/themes'

import { EImageLoader } from '@/components/images/EImageLoader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/types'

export const ImageBR = ({
  image,
  className,
  ...props
}: { image: EImage } & Partial<React.ComponentPropsWithoutRef<typeof EImageLoader>>) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const currentSrc = snipUrl(imageRef.current?.currentSrc || '')
  const currentSize = imageRef.current?.naturalWidth
    ? `${imageRef.current.naturalWidth}x${imageRef.current.naturalHeight}`
    : ''

  const { captionText, captionModelId, nsfwProbability } = image

  return (
    <div className={cn('space-y-2', className)}>
      <Card>
        <EImageLoader ref={imageRef} image={image} {...props} className="mx-auto" />

        {/* debug info */}
        <NonSecureAdminRoleOnly>
          <div className="absolute left-3 top-3 rounded bg-overlay p-1 font-mono text-xs font-medium opacity-10 hover:opacity-100">
            {currentSrc} {currentSize} {image.width}x{image.height}
          </div>
        </NonSecureAdminRoleOnly>
      </Card>

      {/* caption card */}
      {(captionText || captionModelId || nsfwProbability) && (
        <Card size="1">
          <div className="max-h-24 overflow-y-auto break-all pb-1 text-xs">
            {captionText ? captionText : <LoadingSpinner variant="dots" className="w-4" />}
          </div>
          <div className="border-t border-grayA-3 pt-1 font-mono text-xs text-gray-11 flex-between">
            {captionModelId}
            <span>{nsfwProbability ? `NSFW: ${Math.round(nsfwProbability * 100)}%` : null}</span>
          </div>
        </Card>
      )}
    </div>
  )
}

const snipUrl = (url: string) => {
  const match = url.match(/\.([a-z0-9]+)(\?.*)?$/i)
  return match ? match[0] : ''
}
