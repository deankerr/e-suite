import { SuiteShell } from '@/components/suite/suite-shell'
import { db } from '@/lib/db'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function EPage() {
  const session = await db.getSessionUser()
  if (!session) return <p>Not logged in ehh?</p>

  const { user, workbench, agents } = session

  const getUser = () => ({ ...user, agentIds: agents.map((agent) => agent.id) })
  const getWorkbench = () => workbench
  const getAgent = (id: string) => agents.find((agent) => agent.id === id)!

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })

  await queryClient.prefetchQuery({
    queryKey: ['workbench'],
    queryFn: getWorkbench,
  })

  for (const a of agents) {
    await queryClient.prefetchQuery({
      queryKey: ['agent', a.id],
      queryFn: () => getAgent(a.id),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SuiteShell />
    </HydrationBoundary>
  )
}
