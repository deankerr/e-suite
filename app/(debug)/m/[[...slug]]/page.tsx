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
    const { prompt } = message.inference.parameters
    const title = message.inference.title ?? prompt ?? 'A mysterious creation'
    const byline = message.inference.byline ?? 'by nobody (nothing)'

    const imageIds = Array.isArray(message?.content) ? message.content.map((f) => f.imageId) : []
    const gens = message.inference.dimensions
      .map(({ n, width, height }) => Array.from({ length: n }).map((_) => ({ width, height })))
      .flat()

    const imageGens = gens.map((gens, i) => ({ ...gens, imageId: imageIds[i] ?? null }))

    return <MasonryGallery title={title} byline={byline} imageGens={imageGens} />
  }

  return 'no'
}
