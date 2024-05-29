import { IconButton } from '@radix-ui/themes'
import { ChevronsUpDownIcon, DotIcon, XIcon } from 'lucide-react'

import { useThreadStack } from '@/app/t/[[...slug]]/hooks'
import { ThreadCommand } from '@/app/t/[[...slug]]/thread-view/ThreadCommand'
import { chatModels, imageModels } from '@/convex/shared/models'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ThreadViewBarProps = {
  thread: EThreadWithContent
} & React.ComponentProps<'div'>

export const ThreadViewBar = ({ thread, className, ...props }: ThreadViewBarProps) => {
  const stack = useThreadStack()

  const primary = thread.inferenceConfig.primary
  const inference = thread.inferenceConfig[primary]

  const models = [...chatModels, ...imageModels]
  const currentModel = models.find(
    (model) =>
      inference.endpoint === model.endpoint && inference.parameters.model === model.endpointModelId,
  )

  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      <IconButton variant="ghost" color="gray" className="pointer-events-none shrink-0">
        <DotIcon />
      </IconButton>

      <ThreadCommand
        thread={thread}
        trigger={
          <button className="grow rounded-lg border border-transparent py-1 pl-2 flex-between hover:bg-gray-2">
            <div className="grow">
              <div className="text-sm">{thread.title ?? 'new thread'}</div>
              <div className="grow text-sm text-gray-11">{currentModel?.name}</div>
            </div>

            <ChevronsUpDownIcon className="shrink-0 text-gray-11" />
          </button>
        }
      />

      <IconButton
        variant="ghost"
        color="gray"
        className="shrink-0"
        onClick={() => stack.remove(thread?.slug)}
      >
        <XIcon />
      </IconButton>
    </div>
  )
}
