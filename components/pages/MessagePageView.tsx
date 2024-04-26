'use client'

import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'
import NextImage from 'next/image'

import { getImageUrl } from '@/lib/utils'
import { GoldSparklesEffect } from '../canvas/GoldSparklesEffect'
import { GenerationDataList } from '../GenerationDataList'
import { JustifiedRowGrid } from '../JustifiedRowGrid'
import { PageWrapper } from './PageWrapper'

import type { MessageContent } from '@/convex/external'

type MessagePageViewProps = {
  content: MessageContent
}

export const MessagePageView = ({ content }: MessagePageViewProps) => {
  const imageList = content.generated_images ?? []
  // TODO restore generation effect
  // const imageList = generations.flatMap(({ generation, generated_images }) => {
  //   return Array.from({ length: generation.n }).map((_, i) => {
  //     const image = generated_images[i]
  //     return image ? image : { width: generation.width, height: generation.height, skeleton: true }
  //   })
  // })

  const [showSparkles, setShowSparkles] = useState(false)
  const title =
    content.generation?.prompt ?? `Message from ${content.data.name ?? content.data.role}`

  return (
    <PageWrapper icon={<MessageSquareIcon />} title={title}>
      {showSparkles && <GoldSparklesEffect />}
      <div className="grid gap-4 px-4 py-6 sm:grid-cols-[1fr_240px]">
        <div>
          <JustifiedRowGrid
            gap={10}
            items={imageList}
            render={({ rid, width, height, blurDataUrl }, commonHeight) => (
              <div
                className="overflow-hidden rounded-lg border"
                style={{ aspectRatio: width / height, height: commonHeight }}
              >
                <NextImage
                  unoptimized
                  src={getImageUrl(rid)}
                  width={width}
                  height={height}
                  placeholder={blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={blurDataUrl}
                  className="h-full w-full object-cover"
                  alt=""
                />
              </div>
            )}
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
          {content.generation && <GenerationDataList generation={content.generation} />}
        </div>
      </div>
    </PageWrapper>
  )
}

/*

  {/* <Masonry
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
        <ImageThumb key={image.rid} priority={true} image={image} />
      )
    }
  />

*/
