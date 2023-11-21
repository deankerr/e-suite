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

const agentsQueryKeys = {
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
  return useQuery({
    queryKey: agentsQueryKeys.detail(id),
    queryFn: () => getAgent(id),
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
