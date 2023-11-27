import { initializeUserSession } from '@/api/server'
import { cn } from '@/lib/utils'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { agentQueries } from './queries'

export async function AppShell({ className, children }: React.ComponentProps<'div'>) {
  const sessionUser = await initializeUserSession()
  const queryClient = new QueryClient()

  if (sessionUser) {
    const { user, agents } = sessionUser
    const engines = agents.map((agent) => agent.engine)

    const getAgents = () => agents
    const getAgent = (id: string) => agents.find((agent) => agent.id === id)!
    const getEngine = (id: string) => engines.find((engine) => engine.id === id)!

    // await queryClient.prefetchQuery({
    //   queryKey: ['user'],
    //   queryFn: getUser,
    // })

    // await queryClient.prefetchQuery({
    //   queryKey: ['workbench'],
    //   queryFn: getWorkbench,
    // })
    // await queryClient.prefetchQuery({
    //   queryKey: agentsQueryKeys.all,
    //   queryFn: getAgents,
    // })

    // for (const engine of engines) {
    //   await queryClient.prefetchQuery({
    //     queryKey: ['agent', engine.id],
    //     queryFn: () => getEngine(engine.id),
    //   })
    // }
  }

  return (
    <div className={cn('flex h-full divide-x', className)}>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </div>
  )
}
