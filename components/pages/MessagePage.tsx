'use client'

import { Card } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'

import { GenerationDataList } from '@/components/generation/GenerationDataList'
import { GeneratedImageView } from '@/components/images/GeneratedImageView'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import { ErrorCallout } from '@/components/ui/Callouts'
import { useMessageQuery } from '@/lib/queries'
import { GenerationView } from '../generation/GenerationView'
import { PageHeader } from './PageHeader'

type MessagePageProps = {
  rid: string
}

export const MessagePage = ({ rid }: MessagePageProps) => {
  const result = useMessageQuery({ rid })
  const message = result?.message
  const generations = result?.generations

  const imageList = generations?.filter((generation) => generation.result?.type !== 'error') ?? []
  const breakpoints = imageList.length <= 4 ? [520, 768] : [520, 900, 1024]
  const errors = new Set(
    generations
      ?.filter((generation) => generation.result?.type === 'error')
      .map((generation) => generation.result!.message),
  )

  const title = message
    ? generations?.[0]?.prompt ?? `Message from ${message?.name ?? message?.role}`
    : undefined
  const single = generations?.length === 1 ? generations?.[0] : undefined

  return (
    <>
      <PageHeader
        icon={<MessageSquareIcon className="size-5 stroke-[1.5]" />}
        title={title}
        setPageTitle={false}
      />
      {[...errors].map((message) => (
        <ErrorCallout
          key={message}
          title="(sinkin.ai) endpoint returned error:"
          message={message}
        />
      ))}

      {!single && (
        <div className="space-y-4 px-1 py-4">
          <JustifiedRowGrid
            gap={10}
            items={imageList}
            breakpoints={breakpoints}
            render={(generation, commonHeight) => (
              <GeneratedImageView
                key={generation._id}
                generation={generation}
                containerHeight={commonHeight}
                imageProps={{ priority: true }}
              />
            )}
          />

          {generations && generations?.length >= 0 && (
            <Card className="overflow-hidden">
              <GenerationDataList generations={generations} />
            </Card>
          )}
        </div>
      )}

      {single && <GenerationView generation={single} />}
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
