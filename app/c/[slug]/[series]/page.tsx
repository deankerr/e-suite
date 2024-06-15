'use client'

import { Card, Inset } from '@radix-ui/themes'
import { useQuery } from 'convex-helpers/react'

import { Message } from '@/components/message/Message'
import { api } from '@/convex/_generated/api'

export default function Page({ params }: { params: { slug: string; series: string } }) {
  const result = useQuery(api.db.messages.getSeries, {
    slug: params.slug,
    series: Number(params.series),
  })
  return (
    <div className="w-full p-2">
      <Card className="grid h-full w-full">
        <Inset side="all" className="flex flex-col">
          {/* <div className="h-10 shrink-0 border-b border-grayA-3 flex-between"></div> */}

          <div className="flex w-full grow flex-col gap-2 overflow-y-auto overflow-x-hidden px-5 py-1">
            {result.data?.messages[0] ? <Message message={result.data?.messages[0]} /> : null}
          </div>
        </Inset>
      </Card>
    </div>
  )
}
