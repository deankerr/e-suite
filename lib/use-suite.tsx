import { getSuiteUser, updateSuiteUserAgent, updateWorkbench } from '@/components/suite/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fromZodError } from 'zod-validation-error'
import {
  SuiteAgentUpdateMergeObject,
  suiteAgentUpdateMergeSchema,
  SuiteWorkbenchUpdateMergeObject,
  suiteWorkbenchUpdateMergeSchema,
} from './schemas'

export function useSuite() {
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ['suiteUser'],
    queryFn: () => getSuiteUser(),
  })

  const agentMutation = useMutation({
    mutationKey: ['agent'],
    mutationFn: ({ agentId, merge }: { agentId: string; merge: SuiteAgentUpdateMergeObject }) => {
      const parsedMerge = suiteAgentUpdateMergeSchema.safeParse(merge)

      if (!parsedMerge.success) {
        throw new Error(fromZodError(parsedMerge.error).message)
      }

      return updateSuiteUserAgent(agentId, parsedMerge.data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suiteUser'] }),
    onError: (error) => toast.error(error.message),
  })

  const workbenchMutation = useMutation({
    mutationKey: ['workbench'],
    mutationFn: ({ merge }: { merge: SuiteWorkbenchUpdateMergeObject }) => {
      const parsedMerge = suiteWorkbenchUpdateMergeSchema.safeParse(merge)

      if (!parsedMerge.success) {
        throw new Error(fromZodError(parsedMerge.error).message)
      }

      return updateWorkbench(parsedMerge.data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suiteUser'] }),
    onError: (error) => toast.error(error.message),
  })

  return {
    userQuery,
    agentMutation,
    workbenchMutation,
    user: userQuery.data,
    workbench: userQuery.data?.workbench,
    agents: userQuery.data?.agents ?? [],
    tabs: userQuery.data?.workbench.tabs ?? [],
    activeTab: userQuery.data?.workbench.tabs.find(
      (tab) => tab.id === userQuery.data?.workbench.active,
    ),
  }
}
