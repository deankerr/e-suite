import { cn } from '@/lib/utils'
import { Cross1Icon, DotFilledIcon, PlusIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import { Loading } from '../ui/loading'
import { useAgentQueries, useTabs, useWorkbenchQuery } from './queries'

export function SuiteTabBar({ className }: React.ComponentProps<'div'>) {
  const { tabs, focusedTabId, setFocusTab } = useTabs()
  const agents = useAgentQueries(tabs.map((tab) => tab.agentId))

  return (
    <div className={cn('flex items-center overflow-x-auto bg-muted/50', className)}>
      {tabs.map((tab, i) => {
        const isActive = tab.id === focusedTabId
        const agent = agents[i]
        return (
          <div
            key={tab.id}
            className={cn(
              'group flex h-full w-full max-w-[12rem] cursor-pointer items-center border-t-primary bg-muted text-sm font-medium',
              isActive ? 'border-t-2 bg-background' : 'opacity-50 hover:border-x hover:opacity-100',
            )}
            onClick={() => tab.id !== focusedTabId && setFocusTab(tab.id)}
          >
            {/* <CaretRightIcon width={20} height={20} className="inline-block" /> */}
            <div className="w-[26px]"></div>
            <div className="w-full text-center">
              {agent?.data?.name ?? <Loading icon="bars" size="sm" />}
            </div>

            {/* dot / close button */}
            <div className="flex w-7 items-center">
              <Button
                variant="ghost"
                className="h-min w-min rounded-none p-0 hover:text-primary"
                // onClick={onClickClose}
              >
                <DotFilledIcon className="group-hover:hidden" />
                <Cross1Icon width={16} height={16} className="hidden group-hover:inline-flex" />
              </Button>
            </div>
          </div>
        )
      })}

      <Button variant="ghost" className="h-full rounded-none px-1 hover:text-primary">
        <PlusIcon width={20} height={20} />
      </Button>
    </div>
  )
}
