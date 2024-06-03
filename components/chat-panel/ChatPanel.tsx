import { FileQuestionIcon } from 'lucide-react'

import { ChatMessages } from '@/components/chat-panel/body/ChatMessages'
import { ChatHeader } from '@/components/chat-panel/ChatHeader'
import { ChatInput } from '@/components/chat-panel/ChatInput'
import { ChatMenu } from '@/components/chat-panel/ChatMenu'
import { Loading } from '@/components/ui/Loading'
import { useThreadContent, useViewerDetails } from '@/lib/api'
import { cn } from '@/lib/utils'

type ChatPanelProps = {
  threadId: string
  onClosePanel?: () => void
} & React.ComponentProps<'div'>

export const ChatPanel = ({ threadId, onClosePanel, className, ...props }: ChatPanelProps) => {
  const thread = useThreadContent(threadId)
  const { isOwner } = useViewerDetails(thread?.owner._id)

  return (
    <div {...props} className={cn('h-full overflow-hidden', className)}>
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <ChatHeader
          className="sticky top-0 z-10 h-16 shrink-0 border-b bg-gray-1"
          thread={thread}
          onClosePanel={onClosePanel}
        >
          {thread && <ChatMenu thread={thread} />}
        </ChatHeader>

        <div className="flex grow">
          {thread ? (
            <ChatMessages className="mx-auto max-w-2xl" thread={thread} />
          ) : thread === null ? (
            <FileQuestionIcon className="m-auto text-red-11" />
          ) : (
            <Loading className="m-auto" />
          )}
        </div>

        {isOwner && (
          <div className="sticky bottom-0 z-10 shrink-0 gap-2 border-t bg-gray-1">
            {thread && <ChatInput thread={thread} />}
          </div>
        )}
      </div>
    </div>
  )
}
