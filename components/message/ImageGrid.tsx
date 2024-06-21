import { useState } from 'react'

import { GoldSparkles as ImageLoadingEffect } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { Pre } from '@/components/util/Pre'
import { EMessage } from '@/convex/shared/types'
import { cn } from '@/lib/utils'

import type { EImage } from '@/convex/shared/structures'

export const ImageGrid = ({ message }: { message: EMessage }) => {
  const textToImageJobs = message.jobs.filter((job) => job.name === 'inference/text-to-image')
  if (message.inference?.type !== 'text-to-image') {
    return null
  }
  const inference = message.inference?.type === 'text-to-image' ? message.inference : null
  const n = inference?.n ?? 4
  const width = inference?.width ?? 1024
  const height = inference?.height ?? 1024
  const model = inference?.endpointModelId

  const loader = (
    <div
      className="flex overflow-hidden rounded-xl border border-grayA-3"
      style={{
        aspectRatio: 1,
        width: 1024,
        maxWidth: '100%',
      }}
    >
      <div className="animate-shimmerDown absolute bottom-[100%] h-[200%] w-full bg-gradient-to-b from-gold-1 via-gold-4 to-gold-1"></div>

      <div className="animate-starfieldDown absolute inset-0 bg-[url('/textures/stardust.png')]"></div>
      <div className="animate-starfieldDown absolute -top-full h-full w-full bg-[url('/textures/stardust.png')]"></div>

      <div className="absolute flex h-[700px] w-[700px] bg-[url('/n5.svg')]"></div>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-4">
      {loader}
      {loader}
      {loader}
      {loader}

      {/* {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl"
          style={{ aspectRatio: width / height, width: width, maxWidth: '100%' }}
        >
          <ImageLoadingEffect />
        </div>
      ))} */}
    </div>
  )
}
