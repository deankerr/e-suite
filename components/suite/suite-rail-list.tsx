import { SuiteWorkbench } from '@/lib/schemas'
import { useSuite } from '@/lib/use-suite'
import { cn } from '@/lib/utils'
import { CaretDownIcon, CaretRightIcon } from '@radix-ui/react-icons'
import { nanoid } from 'nanoid/non-secure'
import { Loading } from '../ui/loading'

export function SuiteRailList({ className }: React.ComponentProps<'div'>) {
  const suite = useSuite()

  const activateAgentTab = (agentId: string) => {
    if (!suite.workbench) return
    const existingTab = suite.tabs.find((tab) => tab.agentId === agentId)
    if (existingTab) {
      // tab already open, set active
      if (suite.activeTab?.id !== existingTab.id) {
        suite.workbenchMutation.mutate({
          merge: {
            tabs: suite.tabs.map((tab) =>
              tab.id === existingTab.id ? { ...tab, open: true } : tab,
            ),
            active: existingTab.id,
          },
        })
        return
      }
    } else {
      // create new tab
      const tab: SuiteWorkbench['tabs'][number] = {
        id: nanoid(7),
        agentId,
        open: true,
      }

      suite.workbenchMutation.mutate({
        merge: {
          tabs: [...suite.workbench.tabs, tab],
          active: tab.id,
        },
      })
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* <AgentList title="Active"></AgentList> */}
      <AgentList title="Available" open={true}>
        {suite.userQuery.isPending && <Loading />}
        {suite.agents.map((agent) => (
          <li
            key={agent.id}
            className={cn('cursor-pointer text-muted-foreground hover:text-foreground')}
            onClick={() => activateAgentTab(agent.id)}
          >
            <span className="ml-6">{agent.name}</span>
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
      <ul className="list-inside divide-y-2 pt-1">{children}</ul>
    </div>
  )
}

//[&_li]:py-1
