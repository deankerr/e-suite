import { cn } from '@/lib/utils'
import { CaretDownIcon, CaretRightIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { Loading } from '../ui/loading'
import { getSuiteUser } from './actions'

export function SuiteRailList({ className }: {} & React.ComponentProps<'div'>) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({ queryKey: ['suiteUser'], queryFn: () => getSuiteUser() })

  return (
    <div className={cn('space-y-4', className)}>
      <AgentList title="Active"></AgentList>
      <AgentList title="Available" open={true}>
        {isPending && <Loading />}
        {user && user.agents.map((a) => <li key={a.id}>{a.name}</li>)}
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
      <ul className="list-inside list-disc px-2">{children}</ul>
    </div>
  )
}
