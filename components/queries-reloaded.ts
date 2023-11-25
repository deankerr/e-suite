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
  _dep_getAgent,
  _dep_getAgents,
  _dep_getEngine,
  _dep_getEngines,
  _dep_updateAgent,
  getAgent3,
  UpdateAgentDataSchema,
} from './actions-reloaded'

export const agentsQueryKeys = {
  all: ['agents'],
  detail: (id: string) => ['agents', 'detail', id],
} as const

export function useAgents() {
  return useQuery({
    queryKey: agentsQueryKeys.all,
    queryFn: () => _dep_getAgents(),
  })
}

export function useAgentDetail(id = '') {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: agentsQueryKeys.detail(id),
    queryFn: () => _dep_getAgent(id),
    initialData: () => {
      return queryClient
        .getQueryData(
          queryOptions({
            queryKey: agentsQueryKeys.all,
            queryFn: () => _dep_getAgents(),
          }).queryKey,
        )
        ?.find((agent) => agent.id === id)
    },
    enabled: !!id,
  })
}

export function useAgent3({ id }: { id: string }) {
  return useQuery({
    queryKey: ['agent3', id],
    queryFn: () => getAgent3({ id }),
    enabled: !!id,
  })
}

export function useAgentMutation(id = '') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['agent', id],
    mutationFn: async (data: Partial<Agent>) => await _dep_updateAgent(id, data),
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
    queryFn: () => _dep_getEngines(),
  }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['engines', id],
      queryFn: () => _dep_getEngine(id),
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
