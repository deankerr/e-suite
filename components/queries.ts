import { AgentUpdateInputData } from '@/schema/user'
import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAgent, getAllAgents, getAllEngines, getEngine, updateAgent } from './actions'

//* Agents
export const agentQueries = {
  list: queryOptions({ queryKey: [{ entity: 'agents' }], queryFn: () => getAllAgents() }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [{ entity: 'agents', id }],
      queryFn: () => getAgent({ id }),
      enabled: !!id,
    }),
} as const

export function useGetAgentList() {
  return useQuery(agentQueries.list)
}

export function useGetAgentDetail(id: string) {
  return useQuery(agentQueries.detail(id))
}

export function useUpdateAgent(id = '') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [{ entity: 'agents', id }],
    mutationFn: (data: AgentUpdateInputData) => updateAgent({ id, data }),
    onMutate: async (updateData: AgentUpdateInputData) => {
      await queryClient.cancelQueries({ queryKey: [{ entity: 'agents' }] })
      const previousAgent = queryClient.getQueryData(agentQueries.detail(id).queryKey)

      queryClient.setQueryData(
        agentQueries.detail(id).queryKey,
        (old) => old && { ...old, ...updateData },
      )
      return { previousAgent }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, updateData, context) => {
      toast.error(err.message)
      queryClient.setQueryData(agentQueries.detail(id).queryKey, context?.previousAgent)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [{ entity: 'agents' }] })
    },
  })
}

//* Engines
const engineQueries = {
  list: queryOptions({ queryKey: [{ entity: 'engines' }], queryFn: () => getAllEngines() }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [{ entity: 'engines', id }],
      queryFn: () => getEngine({ id }),
      enabled: !!id,
    }),
}

export function useGetEngineList() {
  return useQuery(engineQueries.list)
}

export function useGetEngineDetail(id = '') {
  return useQuery(engineQueries.detail(id))
}
