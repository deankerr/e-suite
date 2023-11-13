import {
  AgentParametersUpdate,
  getAgent,
  getEngine,
  getEngines,
  getUser,
  getWorkbench,
  updateAgent,
  updateAgentParameters,
  updateWorkbench,
  WorkbenchMerge,
} from '@/components/suite/actions'
import {
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { nanoid } from 'nanoid/non-secure'

export function useUserQuery() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => await getUser(),
  })
}

const workbenchQueryOptions = queryOptions({
  queryKey: ['workbench'],
  queryFn: async () => await getWorkbench(),
})

export function useWorkbenchQuery() {
  return useQuery(workbenchQueryOptions)
}

export function useWorkbenchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['workbench'],
    mutationFn: async (merge: WorkbenchMerge) => await updateWorkbench(merge),
    onMutate: async ({ merge }) => {
      await queryClient.cancelQueries({ queryKey: ['workbench'] })
      const previousWorkbench = queryClient.getQueryData(['workbench'])

      queryClient.setQueryData(workbenchQueryOptions.queryKey, (old) =>
        old ? { ...old, ...merge } : undefined,
      )

      return { previousWorkbench }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['workbench'] }),
  })
}

export function useTabs() {
  const workbench = useWorkbenchQuery()
  const workbenchMutation = useWorkbenchMutation()

  const tabs = workbench.data?.tabs ?? []
  const focusedTabId = workbench.data?.focusedTabId ?? ''
  const focusedTab = tabs.find((tab) => tab.id === focusedTabId)

  const createTab = ({ agentId }: { agentId: string }) => {
    if (agentId === '') return
    if (tabs.find((tab) => tab.agentId === agentId)) return

    const newTab = {
      id: nanoid(),
      agentId,
    }

    workbenchMutation.mutate({
      merge: {
        tabs: [...tabs, newTab],
        focusedTabId: newTab.id,
      },
    })
  }

  const setFocusTab = (tabId: string) => {
    if (focusedTabId === tabId) return

    if (!tabs.find((tab) => tab.id === tabId)) {
      return
    }
    const merge = { focusedTabId: tabId }
    workbenchMutation.mutate({ merge })
  }

  return {
    tabs,
    focusedTabId,
    focusedTab,
    setFocusTab,
    createTab,
  }
}

export function useAgentQuery(agentId = '') {
  return useQuery({
    queryKey: ['agent', agentId],
    queryFn: async () => await getAgent(agentId),
    enabled: !!agentId,
  })
}

export function useAgentQueries(agentIds: string[]) {
  return useQueries({
    queries: agentIds.map((agentId) => ({
      queryKey: ['agent', agentId],
      queryFn: async () => await getAgent(agentId),
    })),
  })
}

function getAgentQueryOptions(agentId: string) {
  return queryOptions({
    queryKey: ['agent', agentId],
    queryFn: async () => await getAgent(agentId),
  })
}

export function useAgentMutation(agentId = '') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['agent', agentId],
    mutationFn: async (input: Parameters<typeof updateAgent>[0]) => await updateAgent(input),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['agent', agentId] }),
  })
}

export function useAgentParametersMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['agent', 'parameters'],
    mutationFn: async (update: AgentParametersUpdate) => await updateAgentParameters(update),
    onMutate: async ({ agentId, merge }) => {
      await queryClient.cancelQueries({ queryKey: ['agent', agentId] })
      const previousAgent = queryClient.getQueryData(['agent', agentId])

      queryClient.setQueryData(getAgentQueryOptions(agentId).queryKey, (prevAgent) => {
        if (prevAgent) {
          const parameters = {
            ...prevAgent.parameters,
            ...merge,
          }
          return { ...prevAgent, parameters }
        }
      })

      return { previousAgent }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['agent', 'parameters'] }),
  })
}

export function useEngineQuery(engineId = '') {
  return useQuery({
    queryKey: ['engine', engineId],
    queryFn: async () => await getEngine(engineId),
    enabled: !!engineId,
  })
}

export function useEnginesQuery() {
  return useQuery({
    queryKey: ['engines'],
    queryFn: async () => await getEngines(),
  })
}
