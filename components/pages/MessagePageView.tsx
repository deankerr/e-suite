'use client'

import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'
import { Masonry } from 'react-plock'

import { ImageThumb } from '@/components/ImageThumb'
import { Skeleton } from '@/components/ui/Skeleton'
import { GoldSparklesEffect } from '../canvas/GoldSparklesEffect'
import { GenerationDataList } from '../GenerationDataList'
import { PageWrapper } from './PageWrapper'

import type { Doc } from '@/convex/_generated/dataModel'
import type { ImageModel } from '@/convex/types'

type MessagePageViewProps = {
  message: Doc<'messages'>
  generations: {
    generation: Doc<'generations'>
    model?: ImageModel
    generated_images: Doc<'generated_images'>[]
  }[]
  title: string
  thread: Doc<'threads'>
}

export const MessagePageView = ({ generations, title }: MessagePageViewProps) => {
  const imageList = generations.flatMap(({ generation, generated_images }) => {
    return Array.from({ length: generation.n }).map((_, i) => {
      const image = generated_images[i]
      return image ? image : { width: generation.width, height: generation.height, skeleton: true }
    })
  })

  const dataGeneration = generations[0]
  const [showSparkles, setShowSparkles] = useState(false)

  return (
    <PageWrapper icon={<MessageSquareIcon />} title={title}>
      {showSparkles && <GoldSparklesEffect />}
      <div className="grid gap-4 px-4 py-6 sm:grid-cols-[1fr_240px]">
        <div className="w-full">
          {/* masonry */}
          <Masonry
            items={imageList}
            config={{
              columns: [1, 2],
              gap: [12, 12],
              media: [520, 768],
            }}
            render={(image, idx) =>
              'skeleton' in image ? (
                <Skeleton key={idx} className="h-full bg-gold-3" />
              ) : (
                <ImageThumb key={image._id} priority={true} image={image} />
              )
            }
          />
        </div>

        {/* details */}
        <div className="h-fit min-h-32 overflow-hidden rounded-lg border bg-panel-solid p-4">
          <Button
            variant="soft"
            color={showSparkles ? 'sky' : 'amber'}
            onClick={() => setShowSparkles(!showSparkles)}
          >
            S
          </Button>
          {dataGeneration && (
            <GenerationDataList
              generation={dataGeneration.generation}
              model={dataGeneration.model!}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
