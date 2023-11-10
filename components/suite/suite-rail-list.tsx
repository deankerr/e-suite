import { SuiteWorkbench } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { CaretDownIcon, CaretRightIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid/non-secure'
import { Loading } from '../ui/loading'
import { getSuiteUser, updateWorkbench } from './actions'

export function SuiteRailList({ className }: {} & React.ComponentProps<'div'>) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({ queryKey: ['suiteUser'], queryFn: () => getSuiteUser() })

  const queryClient = useQueryClient()
  const mutWorkbench = useMutation({
    mutationKey: ['workbench'],
    mutationFn: (workbench: SuiteWorkbench) => updateWorkbench(workbench),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suiteUser'] }),
  })

  // TODO tabs hook + reducer
  const workbench = user ? user.workbench : undefined

  const openAgentTab = (agentId: string) => {
    if (!workbench) return
    const tab = workbench.tabs.find((tab) => tab.agentId === agentId)
    if (tab) {
      // set tab active
      if (workbench.active !== tab.id) {
        mutWorkbench.mutate({ ...workbench, active: tab.id })
        return
      }
    } else {
      // create tab
      const tab: SuiteWorkbench['tabs'][number] = {
        id: nanoid(7),
        agentId,
        open: true,
      }

      const newWorkbench: SuiteWorkbench = {
        ...workbench,
        tabs: [...workbench.tabs, tab],
        active: tab.id,
      }

      mutWorkbench.mutate(newWorkbench)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* <AgentList title="Active"></AgentList> */}
      <AgentList title="Available" open={true}>
        {isPending && <Loading />}
        {user &&
          user.agents.map((a) => (
            <li key={a.id} onClick={() => openAgentTab(a.id)}>
              {a.name}
            </li>
          ))}
      </AgentList>
    </div>
  )
}

function AgentList({
  title,
  open,
  className,
  children,
}: { open?: boolean; title: React.ReactNode } & React.ComponentProps<'div'>) {
  const icon = open ? <CaretDownIcon className="inline" /> : <CaretRightIcon className="inline" />
  return (
    <div className={cn('', className)}>
      <div>
        {icon}
        {title}
      </div>
      <ul className="list-inside px-2">{children}</ul>
    </div>
  )
}
