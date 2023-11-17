import { cn } from '@/lib/utils'
import { CaretDownIcon, CaretRightIcon } from '@radix-ui/react-icons'
import { nanoid } from 'nanoid/non-secure'
import { Loading } from '../ui/loading'
import {
  useAgentQueries,
  useTabs,
  useUserQuery,
  useWorkbenchMutation,
  useWorkbenchQuery,
} from './queries'

export function SuiteRailList({ className }: React.ComponentProps<'div'>) {
  const user = useUserQuery()
  const agents = useAgentQueries(user.data?.agentIds ?? [])

  const { createTab } = useTabs()

  return (
    <div className={cn('space-y-4', className)}>
      {/* <AgentList title="Active"></AgentList> */}
      <AgentList title="Available" open={true}>
        {agents.map((agent, i) => {
          if (agent.isError) return 'error'
          return (
            <li
              key={agent.data?.id ?? i}
              className={cn('cursor-pointer text-muted-foreground hover:text-foreground')}
              onClick={() => createTab({ agentId: agent.data?.id ?? '' })}
            >
              <span className="ml-6">
                {agent.isPending ? <Loading icon="bars" size="sm" key={i} /> : agent.data.name}
              </span>
            </li>
          )
        })}
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
      <ul className="list-inside divide-y-2 pt-1">{children}</ul>
    </div>
  )
}

//[&_li]:py-1
