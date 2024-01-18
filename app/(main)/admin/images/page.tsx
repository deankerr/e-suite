/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { api } from '@/convex/_generated/api'
import { Button, Card } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import Image from 'next/image'

export default function ImagesPage() {
  // const images = useQuery(api.files.images.list)

  return (
    <div className="dark:bg-grid-dark relative grid overflow-auto [&_div]:col-start-1 [&_div]:row-start-1">
      <div className="mx-auto max-w-[98vw] space-y-8 rounded p-2">
        {/* {images?.map((image) =>
          image?.source?.url ? (
            <Image
              key={image._id}
              src={image.source.url}
              width={image.source.width}
              height={image.source.height}
              alt="ga"
            /> */}
        {/* ) : (
            <Card key={image._id} className="w-96 bg-gray-1 text-xs">
              {JSON.stringify(image, null, 2)}
            </Card>
          ),
        )} */}
      </div>
    </div>
  )
}
