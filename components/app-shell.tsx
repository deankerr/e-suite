import { getEnginesList } from '@/db/data'
import { initializeUserSession } from '@/db/server'
import { cn } from '@/lib/utils'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { agentQueries, engineQueries } from './queries'

export async function AppShell({ className, children }: React.ComponentProps<'div'>) {
  const sessionUser = await initializeUserSession()
  const queryClient = new QueryClient()

  if (sessionUser) {
    const { agents } = sessionUser
    const engines = await getEnginesList()

    const getAgents = () => agents
    const getAgent = (id: string) => agents.find((agent) => agent.id === id)!
    const getEngines = () => engines
    const getEngine = (id: string) => engines.find((engine) => engine.id === id)!

    await queryClient.prefetchQuery({
      queryKey: agentQueries.list.queryKey,
      queryFn: getAgents,
    })

    for (const agent of agents) {
      await queryClient.prefetchQuery({
        queryKey: agentQueries.detail(agent.id).queryKey,
        queryFn: () => getAgent(agent.id),
      })
    }

    await queryClient.prefetchQuery({
      queryKey: engineQueries.list.queryKey,
      queryFn: () => getEngines(),
    })

    for (const engine of engines) {
      await queryClient.prefetchQuery({
        queryKey: engineQueries.detail(engine.id).queryKey,
        queryFn: () => getEngine(engine.id),
      })
    }
  }

  return (
    <div className={cn('flex h-full divide-x', className)}>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </div>
  )
}
