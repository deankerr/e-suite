/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Image from 'next/image'

export default function ImagesPage() {
  const urls = useQuery(api.fileTable.tempFilesUrls)

  return (
    <div className="dark:bg-grid-dark relative grid overflow-auto [&_div]:col-start-1 [&_div]:row-start-1">
      <div className="mx-auto max-w-[98vw] space-y-8 rounded p-2">
        {urls?.map((url) => (
          <Image key={url} src={url ?? 'missingurl'} width="200" height="200" alt="ga" />
        ))}
      </div>
    </div>
  )
}
