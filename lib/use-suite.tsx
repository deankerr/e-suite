import { getSuiteUser, updateSuiteUserAgent } from '@/components/suite/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fromZodError } from 'zod-validation-error'
import { SuiteAgentUpdateMergeObject, suiteAgentUpdateMergeSchema } from './schemas'

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

  return {
    userQuery,
    agentMutation,
    user: userQuery.data,
    workbench: userQuery.data?.workbench,
    agents: userQuery.data?.agents,
  }
}
