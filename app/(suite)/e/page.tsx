import { SuiteShell } from '@/components/suite/suite-shell'
import { prisma } from '@/lib/prisma'
import { schemaSuiteUserAll, schemaUser, schemaWorkbench } from '@/lib/schemas'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function EPage() {
  const kinde = getKindeServerSession()
  const kindeUser = await kinde.getUser()

  if (!kindeUser) return <p>Not logged in ehh?</p>

  const { agents, workbench, ...user } = await prisma.user.findUniqueOrThrow({
    where: {
      id: kindeUser.id,
    },
    include: {
      agents: {
        include: {
          engine: true,
        },
      },
    },
  })

  const getUser = () => schemaUser.parse({ ...user, agentIds: agents.map((agent) => agent.id) })
  const getWorkbench = () => schemaWorkbench.parse(workbench)
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
