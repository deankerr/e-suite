'use client'

import { useQuery } from 'convex/react'

import { SunBarLoader } from '@/components/ui/SunBarLoader'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { MasonryGallery } from './MasonryGallery'

export default function MessageSlugPage({ params }: { params: { slug: string } }) {
  const message = useQuery(api.messages.getBySlug, { slug: params.slug })

  if (message === null) return <SunBarLoader alert />
  if (!message) return <SunBarLoader />
  if (message.inference?.type !== 'textToImage') return 'not supported'

  const { inference, error } = message
  const title = inference.title ?? inference.parameters.prompt ?? 'A mysterious creation'
  const byline = inference.byline ?? 'by nobody (nothing)'

  const imageIds = Array.isArray(message.content)
    ? message.content.map(({ imageId }) => imageId)
    : []

  return (
    <MasonryGallery
      title={title}
      byline={byline}
      imageIds={imageIds as Id<'images'>[] & string}
      dimensions={inference.dimensions}
      errorMessage={error?.message}
    />
  )
}
