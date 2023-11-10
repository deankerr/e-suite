import { useSuite } from '@/lib/use-suite'
import { cn } from '@/lib/utils'
import { Cross1Icon, DotFilledIcon, PlusIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'

export function SuiteTabBar({ className }: React.ComponentProps<'div'>) {
  const { agents, workbench, workbenchMutation, tabs, activeTab } = useSuite()

  const getTabAgent = (agentId: string) => agents.find((a) => a.id === agentId)

  const setTabActive = (tabId: string) => {
    if (!workbench || workbench.active === tabId) return
    workbenchMutation.mutate({ merge: { active: tabId } })
  }

  const setTabClosed = (tabId: string) => {
    const newTabs = tabs.map((tab) => (tab.id === tabId ? { ...tab, open: false } : tab))
    const newActive = workbench?.active === tabId ? '' : workbench?.active
    workbenchMutation.mutate({ merge: { tabs: newTabs, active: newActive } })
  }

  return (
    <div className={cn('flex items-center overflow-x-auto bg-muted/50', className)}>
      {tabs.map((tab) => {
        const agent = getTabAgent(tab.agentId)
        if (!agent || !tab.open) return null
        return (
          <Tab
            key={tab.id}
            title={agent.name}
            isActive={activeTab?.id === tab.id}
            onClick={() => setTabActive(tab.id)}
            onClickClose={() => setTabClosed(tab.id)}
          />
        )
      })}

      <Button variant="ghost" className="h-full rounded-none px-1 hover:text-primary">
        <PlusIcon width={20} height={20} />
      </Button>
    </div>
  )
}

function Tab({
  title,
  isActive,
  onClick,
  onClickClose,
}: {
  title: string
  isActive: boolean
  onClickClose: () => unknown
} & React.ComponentProps<'div'>) {
  return (
    <div
      // key={t.id}
      className={cn(
        'group flex h-full w-full max-w-[12rem] cursor-pointer items-center border-t-primary bg-muted text-sm font-medium',
        isActive ? 'border-t-2 bg-background' : 'opacity-50 hover:border-x hover:opacity-100',
      )}
      onClick={onClick}
    >
      {/* <CaretRightIcon width={20} height={20} className="inline-block" /> */}
      <div className="w-[26px]"></div>
      <div className="w-full text-center">{title}</div>

      {/* dot / close button */}
      <div className="flex w-7 items-center">
        <Button
          variant="ghost"
          className="h-min w-min rounded-none p-0 hover:text-primary"
          onClick={onClickClose}
        >
          <DotFilledIcon className="group-hover:hidden" />
          <Cross1Icon width={16} height={16} className="hidden group-hover:inline-flex" />
        </Button>
      </div>
    </div>
  )
}
