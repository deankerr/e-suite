import { preloadQuery } from 'convex/nextjs'

import { DashboardPage } from '@/components/pages/DashboardPage'
import { api } from '@/convex/_generated/api'
import { getAuthToken } from '@/lib/auth'

export const metadata = {
  title: 'Dashboard',
}

export default async function Page() {
  const token = await getAuthToken()
  const preloadedThread = await preloadQuery(api.ext.threads.getLatest, {}, { token })
  return (
    <>
      <DashboardPage preloadedThread={preloadedThread} />
    </>
  )
}
