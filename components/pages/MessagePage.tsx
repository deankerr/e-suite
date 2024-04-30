'use client'

import { Card } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'

import { GenerationDataList } from '@/components/images/GenerationDataList'
import { GenerationImage } from '@/components/images/GenerationImage'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import { ErrorCallout } from '@/components/ui/Callouts'
import { PageHeader } from './PageHeader'

import type { MessageContent } from '@/convex/external'

type MessagePageProps = {
  content: MessageContent
}

export const MessagePage = ({ content }: MessagePageProps) => {
  const { message, generations } = content

  const imageList = generations?.filter((generation) => generation.result?.type !== 'error') ?? []
  const breakpoints = imageList.length <= 4 ? [520, 768] : [520, 900, 1024]
  const errors = new Set(
    generations
      ?.filter((generation) => generation.result?.type === 'error')
      .map((generation) => generation.result!.message),
  )

  const title = generations?.[0]?.prompt ?? `Message from ${message.name ?? message.role}`

  return (
    <>
      <PageHeader icon={<MessageSquareIcon className="size-5 stroke-[1.5]" />} title={title} />
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
          render={(generation, commonHeight) => (
            <GenerationImage
              key={generation._id}
              generation={generation}
              containerHeight={commonHeight}
              imageProps={{ priority: true }}
            />
          )}
        />
      </div>

      {/* details */}
      <Card className="overflow-hidden">
        {generations?.[0] && <GenerationDataList generations={generations} />}
      </Card>
    </>
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
