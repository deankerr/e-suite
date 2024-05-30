import { preloadQuery } from 'convex/nextjs'

import { ThreadsPage } from '@/components/pages/ThreadsPage'
import { api } from '@/convex/_generated/api'

export default async function Page() {
  const preloadedList = await preloadQuery(api.threads.query.listViewerThreads, {})
  return <ThreadsPage preloadedThreads={preloadedList} />
}
