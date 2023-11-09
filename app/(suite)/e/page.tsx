import { auth } from '@/auth'
import { SuiteShell } from '@/components/suite/suite-shell'
import { db } from '@/lib/db'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function EPage() {
  const session = await auth()
  if (!session) return <p>Not logged in ehh?</p>

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['suiteUser'],
    queryFn: () => db.getSuiteUser(session.user.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SuiteShell session={session} />
    </HydrationBoundary>
  )
}
