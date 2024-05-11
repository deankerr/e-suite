'use client'

import { MessageSquareIcon } from 'lucide-react'

import { GeneratedImageView } from '@/components/images/GeneratedImageView'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import { PageHeader } from '@/components/pages/PageHeader'
import { useMessage } from '@/lib/api'

type NewMessagePageProps = { rid: string }

export const NewMessagePage = ({ rid }: NewMessagePageProps) => {
  const message = useMessage(rid)

  const title = `Message from ${message?.name ?? message?.role}`

  return (
    <>
      <PageHeader
        icon={<MessageSquareIcon className="size-5" />}
        title={title}
        setPageTitle={true}
      />

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
