import { auth } from '@/auth'
import { SuiteShell } from '@/components/suite/suite-shell'
import { prisma } from '@/lib/prisma'
import { schemaSuiteUserAll, schemaUser, schemaWorkbench } from '@/lib/schemas'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function EPage() {
  const session = await auth()
  if (!session) return <p>Not logged in ehh?</p>

  const { agents, workbench, ...user } = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
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

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })

  await queryClient.prefetchQuery({
    queryKey: ['workbench'],
    queryFn: getWorkbench,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SuiteShell session={session} />
    </HydrationBoundary>
  )
}
