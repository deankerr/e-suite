import { schemaAgent } from '@/lib/schemas'
import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getAgent, getAgents } from './actions-reloaded'

export function usePathnameFocusedAgentId() {
  const { id } = useParams()
  return id ? id[0] : undefined
}

export const agentsQueryKeys = {
  all: ['agents'],
  detail: (id: string) => ['agents', 'detail', id],
} as const

export function useAgents() {
  return useQuery({
    queryKey: agentsQueryKeys.all,
    queryFn: () => getAgents(),
  })
}

export function useAgentDetail(id = '') {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: agentsQueryKeys.detail(id),
    queryFn: () => getAgent(id),
    initialData: () => {
      return queryClient
        .getQueryData(
          queryOptions({
            queryKey: agentsQueryKeys.all,
            queryFn: () => getAgents(),
          }).queryKey,
        )
        ?.find((agent) => agent.id === id)
    },
    enabled: !!id,
  })
}

export function useActiveAgent() {
  const active = usePathnameFocusedAgentId() ?? ''

  return useQuery({
    queryKey: agentsQueryKeys.detail(active),
    queryFn: ({ queryKey }) => getAgent(queryKey[2]),
    enabled: !!active,
  })
}
