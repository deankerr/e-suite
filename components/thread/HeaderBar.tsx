import { IconButton } from '@radix-ui/themes'
import { ChevronsUpDownIcon, DotIcon, XIcon } from 'lucide-react'

import { CommandMenu } from '@/components/thread/CommandMenu'
import { useModelsData } from '@/components/thread/hooks'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type HeaderBarProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const HeaderBar = ({ thread, className, ...props }: HeaderBarProps) => {
  const { getModel } = useModelsData()
  const inference = thread.inferenceConfig[thread.inferenceConfig.primary]
  const currentModel = getModel([inference.endpoint, inference.parameters.model])

  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      <IconButton variant="ghost" color="gray" className="pointer-events-none shrink-0">
        <DotIcon />
      </IconButton>

      <div>
        <CommandMenu thread={thread}>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded border border-gray-3 py-1 text-sm font-medium ring-accent-7 ring-offset-gray-1 transition-colors hover:bg-gray-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-8 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <div className="w-5"></div>
            <div>
              <div>{thread.title ?? 'new thread'}</div>
              <div className="font-normal text-gray-11">{currentModel.name}</div>
            </div>
            <ChevronsUpDownIcon className="ml-1 shrink-0 text-gray-10" />
          </button>
        </CommandMenu>
      </div>

      <IconButton
        variant="ghost"
        color="gray"
        className="shrink-0"
        // onClick={() => stack.remove(thread?.slug)}
      >
        <XIcon />
      </IconButton>
    </div>
  )
}
