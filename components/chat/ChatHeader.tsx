import { IconButton } from '@radix-ui/themes'
import { LinkIcon, MessagesSquareIcon } from 'lucide-react'
import Link from 'next/link'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { useChat } from '@/components/chat/ChatProvider'

export const ChatHeader = () => {
  const { thread } = useChat()
  return (
    <div className="h-10 shrink-0 border-b border-grayA-3 flex-between">
      <div className="shrink-0 gap-2 pl-3 flex-start">
        {thread && (
          <>
            <ChatMenu thread={thread}>
              <IconButton variant="ghost">
                <MessagesSquareIcon className="size-5" />
              </IconButton>
            </ChatMenu>
            <div className="text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
          </>
        )}
      </div>

      <div className="shrink-0 gap-2 pl-3 pr-3 flex-end">
        {thread && (
          <Link href={`/c/${thread?.slug}`}>
            <LinkIcon className="size-4 text-gray-11" />
          </Link>
        )}
      </div>
    </div>
  )
}
