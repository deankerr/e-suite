'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function IIdPage({ params }: { params: { id: Id<'images'> } }) {
  const image = useQuery(api.files.images.get, { imageId: params.id })

  const originalUrl = image?.storageUrl
  const optUrl = image?.optimizedUrl

  return (
    <div className="flex p-4">
      {originalUrl && <img src={originalUrl} alt="" />}
      {optUrl && <img src={optUrl} alt="" />}
    </div>
  )
}
