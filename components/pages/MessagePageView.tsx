'use client'

import { MessageSquareIcon } from 'lucide-react'

import { useTitle } from '@/app/hooks'
import { GenerationDataList } from '../GenerationDataList'
import { ImageFile } from '../images/ImageFile'
import { JustifiedRowGrid } from '../images/JustifiedRowGrid'
import { ErrorCallout } from '../ui/Callouts'
import { PageWrapper } from './PageWrapper'

import type { MessageContent } from '@/convex/external'

type MessagePageViewProps = {
  content: MessageContent
}

export const MessagePageView = ({ content }: MessagePageViewProps) => {
  const { message, generations } = content

  const imageList = generations?.filter((generation) => generation.result?.type !== 'error') ?? []
  const breakpoints = imageList.length <= 4 ? [520, 768] : [520, 768, 1024]
  const errors = new Set(
    generations
      ?.filter((generation) => generation.result?.type === 'error')
      .map((generation) => generation.result!.message),
  )

  const title = generations?.[0]?.prompt ?? `Message from ${message.name ?? message.role}`
  useTitle(title)

  return (
    <PageWrapper icon={<MessageSquareIcon />} title={title}>
      <div className="px-1 py-4">
        {[...errors].map((message) => (
          <ErrorCallout
            key={message}
            title="(sinkin.ai) endpoint returned error:"
            message={message}
          />
        ))}
        <JustifiedRowGrid
          gap={10}
          items={imageList}
          breakpoints={breakpoints}
          render={(generation, commonHeight) => {
            if (generation.image) {
              const { _id, rid, width, height, blurDataUrl } = generation.image
              return (
                <ImageFile
                  key={_id}
                  rid={rid}
                  width={width}
                  height={height}
                  blurDataUrl={blurDataUrl}
                  style={{ height: `${commonHeight}px` }}
                />
              )
            }

            const { _id, width, height } = generation
            return (
              <ImageFile
                key={_id}
                rid={'*generating*'}
                width={width}
                height={height}
                style={{ height: `${commonHeight}px` }}
              />
            )
          }}
        />
      </div>

      {/* details */}
      <div className="h-fit min-h-32 overflow-hidden rounded-lg border bg-panel-solid p-4">
        {generations?.[0] && <GenerationDataList generations={generations} />}
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
