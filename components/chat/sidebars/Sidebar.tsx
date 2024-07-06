import { useChat } from '@/components/chat/ChatProvider'
import { ChatSidebar } from '@/components/chat/sidebars/ChatSidebar'
import { ImageSidebar } from '@/components/chat/sidebars/ImageSidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useChatState } from '@/lib/atoms'
import { cn } from '@/lib/utils'

export const Sidebar = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  const [chatState, setChatState] = useChatState(thread?.slug ?? '')
  if (!chatState.sidebarOpen) return null
  return (
    <>
      <div
        className="absolute inset-0 bg-overlay opacity-50 lg:hidden"
        onClick={() => setChatState((state) => ({ ...state, sidebarOpen: false }))}
      ></div>
      <div
        {...props}
        className={cn(
          'absolute right-0 h-full w-80 shrink-0 overflow-hidden border-l border-grayA-3 bg-panel-solid lg:static',
          className,
        )}
      >
        {thread === undefined && (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {thread && thread.inference.type === 'chat-completion' && (
          <ChatSidebar
            key={thread.inference.resourceKey}
            thread={thread}
            config={thread.inference}
          />
        )}

        {thread && thread.inference.type === 'text-to-image' && (
          <ImageSidebar
            key={thread.inference.resourceKey}
            thread={thread}
            config={thread.inference}
          />
        )}
      </div>
    </>
  )
}
