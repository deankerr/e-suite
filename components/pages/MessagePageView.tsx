'use client'

import { MessageSquareIcon } from 'lucide-react'

import { useTitle } from '@/app/hooks'
import { GenerationDataList } from '../GenerationDataList'
import { ImageFile } from '../images/ImageFile'
import { JustifiedRowGrid } from '../images/JustifiedRowGrid'
import { PageWrapper } from './PageWrapper'

import type { MessageContent } from '@/convex/external'

type MessagePageViewProps = {
  content: MessageContent
}

export const MessagePageView = ({ content }: MessagePageViewProps) => {
  const { generation, generated_images } = content

  let count = 0
  const imageList =
    generation?.dimensions.flatMap(({ width, height, n }, i) => {
      return Array.from({ length: n }).map((_, j) => {
        const image = generated_images?.[count++]
        return image ? image : { width, height, rid: `*generating*${i}+${j}`, blurDataUrl: '' }
      })
    }) ?? []

  const title =
    content.generation?.prompt ?? `Message from ${content.data.name ?? content.data.role}`
  useTitle(title)

  const breakpoints = imageList.length <= 4 ? [520, 768] : [520, 768, 1024]
  return (
    <PageWrapper icon={<MessageSquareIcon />} title={title}>
      <div className="grid gap-4 px-4 py-6 sm:grid-cols-[1fr_240px]">
        <div>
          <JustifiedRowGrid
            gap={10}
            items={imageList}
            breakpoints={breakpoints}
            render={({ rid, width, height, blurDataUrl }, commonHeight) => (
              <ImageFile
                key={rid}
                rid={rid}
                width={width}
                height={height}
                blurDataUrl={blurDataUrl}
                style={{ height: `${commonHeight}px` }}
              />
            )}
          />
        </div>

        {/* details */}
        <div className="h-fit min-h-32 overflow-hidden rounded-lg border bg-panel-solid p-4">
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
