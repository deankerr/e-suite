import { cn } from '@/lib/utils'
import {
  CaretDownIcon,
  CaretRightIcon,
  CircleIcon,
  RocketIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loading } from '../ui/loading'
import { getUserAgents } from './actions'

export function SuiteRailList({ className }: {} & React.ComponentProps<'div'>) {
  const agents = useQuery({
    queryKey: ['agents'],
    queryFn: () => getUserAgents(),
  })

  const availableList = agents.isError ? (
    'error'
  ) : agents.isPending ? (
    <Loading icon="bars" />
  ) : (
    agents.data.map((a) => (
      <li key={a.id} className="pl-6">
        {a.name}
      </li>
    ))
  )

  if (agents.isError) toast.error(agents.error.message)

  return (
    <div className={cn('space-y-4', className)}>
      <AgentList title="Active"></AgentList>
      <AgentList title="Available" open={true}>
        {availableList}
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
      <ul>{children}</ul>
    </div>
  )
}
