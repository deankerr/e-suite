'use client'

import { MessageSquareIcon } from 'lucide-react'

import { ImageThumb } from '@/components/ImageThumb'
import { Skeleton } from '@/components/ui/Skeleton'
import { GenerationDataList } from '../GenerationDataList'
import { PageWrapper } from './PageWrapper'

import type { Doc } from '@/convex/_generated/dataModel'
import type SinkinModels from '@/convex/providers/sinkin.models.json'

type MessagePageViewProps = {
  message: Doc<'messages'>
  generations: {
    generation: Doc<'generations'>
    model?: (typeof SinkinModels)[number]
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

  return (
    <PageWrapper icon={<MessageSquareIcon />} title={title}>
      <div className="grid gap-4 px-4 py-6 sm:grid-cols-[1fr_240px]">
        {/* images */}
        <div className="space-y-4">
          {imageList.map((image, i) =>
            'skeleton' in image ? (
              <Skeleton key={i} className="h-full bg-gold-3" style={{ width: `${30}rem` }} />
            ) : (
              <ImageThumb
                key={image._id}
                style={{ width: `${30}rem` }}
                priority={true}
                image={image}
              />
            ),
          )}
        </div>

        {/* details */}
        <div className="h-fit min-h-32 overflow-hidden rounded-lg border bg-panel-solid p-4">
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
