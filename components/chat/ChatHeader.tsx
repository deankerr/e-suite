import { IconButton } from '@radix-ui/themes'
import { Link, LinkIcon, MessagesSquareIcon } from 'lucide-react'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { useChat } from '@/components/chat/ChatProvider'
import { cn } from '@/lib/utils'

export const ChatHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  return (
    <div {...props} className={cn('h-10 shrink-0 border-b border-grayA-3 flex-between', className)}>
      <div className="shrink-0 gap-2 pl-3 flex-start">
        {thread && (
          <ChatMenu thread={thread}>
            <IconButton variant="ghost">
              <MessagesSquareIcon className="size-5" />
            </IconButton>
          </ChatMenu>
        )}
        <div className="text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
      </div>

      <div className="shrink-0 gap-2 pl-3 pr-3 flex-end">
        <Link href={`/c/${thread?.slug}`}>
          <LinkIcon className="size-5 text-gray-11" />
        </Link>
      </div>
    </div>
  )
}
