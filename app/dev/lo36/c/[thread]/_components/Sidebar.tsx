import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { ImageModelCardH } from '@/components/cards/ImageModelCard'
import { cn } from '@/lib/utils'

import type { EThread } from '@/convex/types'

export const Sidebar = ({
  thread,
  className,
  ...props
}: { thread: EThread } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'right-0 flex h-full w-full min-w-56 max-w-80 flex-col gap-2 overflow-hidden bg-gray-2 px-0.5',
        className,
      )}
    >
      <div className="flex min-h-11 shrink-0 items-center p-3 text-base font-medium">
        {thread?.title ?? <span className="italic text-gray-10">untitled</span>}
      </div>

      <div className="px-2">
        {thread.model?.type === 'chat' && <ChatModelCard model={thread.model} />}
        {thread.model?.type === 'image' && <ImageModelCardH model={thread.model} />}
      </div>
    </div>
  )
}
