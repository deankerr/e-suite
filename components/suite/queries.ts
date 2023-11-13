import {
  getAgent,
  getEngine,
  getUser,
  getWorkbench,
  testGetUser,
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

export function useTestActionQuery() {
  return useQuery({
    queryKey: ['tesetaction'],
    queryFn: async () => await testGetUser(''),
  })
}

export function useUserQuery() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
  })
}

const workbenchQueryOptions = queryOptions({
  queryKey: ['workbench'],
  queryFn: () => getWorkbench(),
})

export function useWorkbenchQuery() {
  return useQuery(workbenchQueryOptions)
}

export function useWorkbenchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['workbench'],
    mutationFn: ({ merge }: { merge: WorkbenchMerge }) => updateWorkbench(merge),
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
    const merge: WorkbenchMerge = {}
    if (!tabs.find((tab) => tab.id === tabId)) {
      return
    }
    merge.focusedTabId = tabId
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
    queryFn: () => getAgent(agentId),
    enabled: !!agentId,
  })
}

export function useAgentQueries(agentIds: string[]) {
  return useQueries({
    queries: agentIds.map((agentId) => ({
      queryKey: ['agent', agentId],
      queryFn: () => getAgent(agentId),
    })),
  })
}

export function useEngineQuery(engineId = '') {
  return useQuery({
    queryKey: ['engine', engineId],
    queryFn: () => getEngine(engineId),
    enabled: !!engineId,
  })
}
