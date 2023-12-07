import { _throws_getUserSession, getIsAuthenticated } from '@/data/auth'
import { getEngines } from '@/data/engines'
import { getUserAgents } from '@/data/user-agents'
import { cn } from '@/lib/utils'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { agentQueries, engineQueries } from './queries'

export async function AppShell({ className, children }: React.ComponentProps<'div'>) {
  const queryClient = new QueryClient()

  const isAuthed = await getIsAuthenticated()
  if (isAuthed) {
    const sessionUser = await _throws_getUserSession()
    const agents = await getUserAgents()
    const engines = await getEngines()

    const preGetAgents = () => agents
    const preGetAgent = (id: string) => agents.find((agent) => agent.id === id)!
    const preGetEngines = () => engines
    const preGetEngine = (id: string) => engines.find((engine) => engine.id === id)!

    await queryClient.prefetchQuery({
      queryKey: agentQueries.list.queryKey,
      queryFn: preGetAgents,
    })

    for (const agent of agents) {
      await queryClient.prefetchQuery({
        queryKey: agentQueries.detail(agent.id).queryKey,
        queryFn: () => preGetAgent(agent.id),
      })
    }

    await queryClient.prefetchQuery({
      queryKey: engineQueries.list.queryKey,
      queryFn: () => preGetEngines(),
    })

    for (const engine of engines) {
      await queryClient.prefetchQuery({
        queryKey: engineQueries.detail(engine.id).queryKey,
        queryFn: () => preGetEngine(engine.id),
      })
    }
  }

  return (
    <div className={cn('flex h-full divide-x', className)}>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </div>
  )
}
