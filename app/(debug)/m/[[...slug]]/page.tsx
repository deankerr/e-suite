'use client'

import { useQuery } from 'convex/react'

import { SunBarLoader } from '@/components/ui/SunBarLoader'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { MasonryGallery } from './MasonryGallery'

export default function MPage({ params }: { params: { slug?: [Id<'messages'>] } }) {
  const messageId = params.slug ? params.slug[0] : undefined
  const queryKey = messageId ? { messageId } : 'skip'
  const message = useQuery(api.messages.get, queryKey)

  if (!message) return <SunBarLoader />

  if (message?.inference?.type === 'textToImage') {
    const { n, width, height, prompt } = message.inference.parameters
    const title = message.inference.title ?? prompt ?? 'A mysterious creation'
    const byline = message.inference.byline ?? 'by nobody (nothing)'

    const imageIds = Array.isArray(message?.content) ? message.content.map((f) => f.imageId) : []
    const imageGen = Array.from({ length: n }).map((_) => ({
      width,
      height,
    }))

    return <MasonryGallery title={title} byline={byline} imageIds={imageIds} imageGen={imageGen} />
  }

  return 'no'
}
