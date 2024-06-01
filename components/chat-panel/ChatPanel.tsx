import { MessageCard } from '@/components/cards/message-card/MessageCard'
import { ChatHeader } from '@/components/chat-panel/ChatHeader'
import { ChatInput } from '@/components/chat-panel/ChatInput'
import { ChatMenu } from '@/components/chat-panel/ChatMenu'
import { Loading } from '@/components/ui/Loading'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { useThreadContent } from '@/lib/api'
import { cn } from '@/lib/utils'

type ChatPanelProps = {
  threadId: string
  onClosePanel: () => void
} & React.ComponentProps<'div'>

export const ChatPanel = ({ threadId, onClosePanel, className, ...props }: ChatPanelProps) => {
  const thread = useThreadContent(threadId)

  return (
    <div {...props} className={cn('h-full overflow-hidden', className)}>
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <ChatHeader
          className="sticky top-0 z-10 h-16 shrink-0 border-b bg-gray-2"
          onClosePanel={onClosePanel}
        >
          {thread && <ChatMenu thread={thread} />}
        </ChatHeader>

        <div className="flex grow flex-col gap-4 p-3">
          {thread ? (
            thread.messages?.map((message) => <MessageCard key={message._id} message={message} />)
          ) : (
            <Loading className="m-auto" />
          )}
        </div>

        <Footer className="sticky bottom-0 z-10 shrink-0 gap-2 border-t bg-gray-1">
          {thread && <ChatInput thread={thread} />}
        </Footer>

        {/* debug ui */}
        <NonSecureAdminRoleOnly>
          <div className="absolute left-0 top-0 font-mono text-xs text-gold-4">{thread?.slug}</div>
        </NonSecureAdminRoleOnly>
      </div>
    </div>
  )
}

export const Footer = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div {...props} className={cn('', className)} />
}
