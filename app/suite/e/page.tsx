import { Suite } from '@/components/suite/_suite'
import { db } from '@/lib/db'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function EPage() {
  const session = await db.getSessionUser()
  if (!session) return <p>Not logged in ehh?</p>

  const { user, workbench, agents } = session
  const engines = agents.map((agent) => agent.engine)

  const getUser = () => ({ ...user, agentIds: agents.map((agent) => agent.id) })
  const getWorkbench = () => workbench
  const getAgent = (id: string) => agents.find((agent) => agent.id === id)!
  const getEngine = (id: string) => engines.find((engine) => engine.id === id)!

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

  for (const engine of engines) {
    await queryClient.prefetchQuery({
      queryKey: ['agent', engine.id],
      queryFn: () => getEngine(engine.id),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suite />
    </HydrationBoundary>
  )
}
