import { auth } from '@/auth'
import { getUser } from '@/components/suite/actions'
import { SuiteShell } from '@/components/suite/suite-shell'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function EPage() {
  const session = await auth()
  if (!session) return <p>Not logged in ehh?</p>

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: () => getUser(session.user.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SuiteShell session={session} />
    </HydrationBoundary>
  )
}
