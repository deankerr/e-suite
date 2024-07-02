'use client'

import { Card, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex-helpers/react'

import { Message } from '@/components/message/Message'
import { api } from '@/convex/_generated/api'

export const dynamic = 'force-dynamic'

export default function Page({ params }: { params: { slug: string; series: string } }) {
  const result = useQuery(api.db.messages.getSeries, {
    slug: params.slug,
    series: Number(params.series),
  })
  return (
    <div className="h-full w-full p-2 pt-0 sm:pl-0 sm:pt-2">
      <Card className="grid h-full w-full">
        <Inset side="all" className="flex flex-col">
          <div className="flex w-full grow flex-col gap-2 overflow-y-auto overflow-x-hidden px-5 py-1">
            {result.data?.messages[0] ? (
              <div className="m-auto">
                <Message message={result.data?.messages[0]} showTimeline={false} />
              </div>
            ) : null}
          </div>
        </Inset>
      </Card>
    </div>
  )
}
