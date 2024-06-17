import { useAtomValue } from 'jotai'

import { useChat } from '@/components/chat/ChatProvider'
import { ChatSidebar } from '@/components/chat/sidebars/ChatSidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { showSidebarAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

export const Sidebar = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  const showSidebar = useAtomValue(showSidebarAtom)
  if (!showSidebar) return null
  return (
    <div
      {...props}
      className={cn('h-full w-80 shrink-0 overflow-hidden border-r border-grayA-3', className)}
    >
      {thread === undefined && <LoadingSpinner />}

      {thread && thread.config.ui.type === 'chat-completion' && (
        <ChatSidebar key={thread.config.ui.resourceKey} thread={thread} config={thread.config.ui} />
      )}

      {/* {thread && thread.config.ui.type === 'text-to-image' && (
        <ImageSidebar
          key={thread.config.ui.resourceKey}
          thread={thread}
          config={thread.config.ui}
        />
      )} */}
    </div>
  )
}
