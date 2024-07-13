import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { ImageModelCardH } from '@/components/cards/ImageModelCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

import type { EThread } from '@/convex/types'
import type { ClassNameValue } from '@/lib/utils'

const Shell = ({
  className,
  children,
}: {
  className?: ClassNameValue
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'flex h-full w-60 shrink-0 flex-col gap-2 overflow-hidden bg-gray-2 px-0.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const SidebarSkeleton = () => {
  return (
    <Shell className="bg-gray-1">
      <Skeleton className="absolute inset-0" />
    </Shell>
  )
}

export const Sidebar = ({
  thread,
  className,
  ...props
}: { thread: EThread } & React.ComponentProps<'div'>) => {
  return (
    <Shell {...props}>
      <div className="flex min-h-11 shrink-0 items-center p-3 text-base font-medium">
        {thread?.title ?? <span className="italic text-gray-10">untitled</span>}
      </div>

      <div className="px-2">
        {thread.model?.type === 'chat' && <ChatModelCard model={thread.model} />}
        {thread.model?.type === 'image' && <ImageModelCardH model={thread.model} />}
      </div>
    </Shell>
  )
}
