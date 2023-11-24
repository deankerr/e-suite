import { Agent } from '@/lib/db'
import { schemaAgent } from '@/lib/schemas'
import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  getAgent,
  getAgents,
  getEngine,
  getEngines,
  updateAgent,
  UpdateAgentDataSchema,
} from './actions-reloaded'

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

export function useAgentMutation(id = '') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['agent', id],
    mutationFn: async (data: Partial<Agent>) => await updateAgent(id, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['agents'] })

      // TODO type w/ queryfn
      queryClient.setQueryData(agentsQueryKeys.detail(id), (prev: Agent | undefined) => {
        if (prev) {
          return {
            ...prev,
            ...data,
          }
        }
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

const engineQueries = {
  all: queryOptions({
    queryKey: ['engines'],
    queryFn: () => getEngines(),
  }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['engines', id],
      queryFn: () => getEngine(id),
    }),
} as const

export function useEngines() {
  return useQuery(engineQueries.all)
}

export function useEngine(id: string) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: engineQueries.detail(id).queryKey,
    queryFn: engineQueries.detail(id).queryFn,
    initialData: () => {
      return queryClient
        .getQueryData(engineQueries.all.queryKey)
        ?.find((engine) => engine.id === id)
    },
    enabled: !!id,
  })
}
