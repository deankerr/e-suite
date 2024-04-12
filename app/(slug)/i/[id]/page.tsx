'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function IIdPage({ params }: { params: { id: Id<'images'> } }) {
  const image = useQuery(api.files.images.get, { imageId: params.id })

  const storageUrl = image?.storageUrl
  const sourceUrl = image?.sourceStorageUrl

  return (
    <div className="flex p-4">
      {storageUrl && <img src={storageUrl} alt="" />}
      {sourceUrl && <img src={sourceUrl} alt="" />}
    </div>
  )
}
