import { getSuiteUser, updateSuiteUserAgent } from '@/components/suite/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SuiteAgentUpdateMergeObject } from './schemas'

export function useSuite() {
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ['suiteUser'],
    queryFn: () => getSuiteUser(),
  })

  const agentMutation = useMutation({
    mutationKey: ['agent'],
    mutationFn: ({ agentId, merge }: { agentId: string; merge: SuiteAgentUpdateMergeObject }) =>
      updateSuiteUserAgent(agentId, merge),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suiteUser'] }),
    onError: (error) => toast.error(error.message),
  })

  return { userQuery, agentMutation }
}
