import { Chats, Images, Sidebar, X } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { useChat } from '@/components/chat/ChatProvider'
import { VoiceoverAutoplayButton } from '@/components/voiceovers/VoiceoverAutoplayButton'
import { showSidebarAtom } from '@/lib/atoms'
import { useViewerDetails } from '@/lib/queries'

export const ChatHeader = () => {
  const { thread, closeChat } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)

  const toggleSidebar = useSetAtom(showSidebarAtom)

  const Icon = thread?.config.ui.type === 'text-to-image' ? Images : Chats
  return (
    <div className="h-10 shrink-0 border-b border-grayA-3 flex-between">
      <div className="shrink-0 gap-2 pl-3 flex-start">
        {thread && (
          <>
            {isOwner || thread.slug.startsWith('_') ? (
              <ChatMenu thread={thread}>
                <IconButton variant="ghost">
                  <Icon className="size-5" />
                </IconButton>
              </ChatMenu>
            ) : (
              <IconButton variant="ghost" className="pointer-events-none">
                <Icon className="size-5" />
              </IconButton>
            )}
            <div className="text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
          </>
        )}
      </div>

      <div className="shrink-0 gap-2 pl-3 pr-3 flex-end">
        {thread?._id && (
          <>
            <VoiceoverAutoplayButton threadId={thread._id} />
            <IconButton variant="ghost" color="gray" onClick={() => toggleSidebar()}>
              <Sidebar className="size-5" />
            </IconButton>
          </>
        )}

        {closeChat && (
          <IconButton variant="ghost" color="gray" onClick={closeChat}>
            <X className="size-5" />
          </IconButton>
        )}
      </div>
    </div>
  )
}
