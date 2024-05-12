'use client'

import { GeneratedImageView } from '@/components/images/GeneratedImageView'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import { useMessage } from '@/lib/api'

type MessagePageProps = { rid: string }

export const MessagePage = ({ rid }: MessagePageProps) => {
  const message = useMessage(rid)

  // const title = `Message from ${message?.name ?? message?.role}`

  return (
    <>
      <div className="space-y-4 px-1 py-4">
        <JustifiedRowGrid
          gap={10}
          items={message.images}
          // breakpoints={breakpoints}
          render={(generation, commonHeight) => (
            <GeneratedImageView
              key={generation._id}
              generation={generation}
              containerHeight={commonHeight}
              imageProps={{ priority: true }}
            />
          )}
        />

        {/* {generations && generations?.length >= 0 && (
            <Card className="overflow-hidden">
              <GenerationDataList generations={generations} />
            </Card>
          )} */}
      </div>
    </>
  )
}
