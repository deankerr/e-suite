import { fetchQuery } from 'convex/nextjs'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
  thread,
  message,
}: {
  params: { slug: string }
  thread: React.ReactNode // NOTE next types require these for some reason
  message: React.ReactNode // NOTE they're not really here
}): Promise<Metadata> {
  const { slug } = params
  const threadData = await fetchQuery(api.db.threads.getPageMetadata, {
    slugOrId: slug,
  })
  if (!threadData) return {}
  console.log('?', thread, message)

  const metadata: Metadata = {
    title: threadData.title,
  }

  if (threadData.description) {
    metadata.description = `${appConfig.siteDescription} · ${threadData.description}`
  }

  return metadata
}

export default function Layout({
  children,
  thread,
  message,
}: {
  children: React.ReactNode
  thread: React.ReactNode
  message: React.ReactNode
}) {
  return (
    <>
      {thread}
      {message}
      {children}
    </>
  )
}
