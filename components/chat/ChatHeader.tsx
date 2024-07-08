import { Chats, Images, Sidebar } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { useChat } from '@/components/chat/ChatProvider'
import { FilterControl } from '@/components/chat/FilterControl'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { VoiceoverAutoplayButton } from '@/components/voiceovers/VoiceoverAutoplayButton'
import { useChatState } from '@/lib/atoms'
import { useViewerDetails } from '@/lib/queries'

export const ChatHeader = () => {
  const { thread } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)

  const [chatState, setChatState] = useChatState(thread?.slug ?? '')

  const Icon = thread?.inference.type === 'text-to-image' ? Images : Chats
  return (
    <div className="h-11 shrink-0 border-b border-grayA-3 flex-start">
      {thread && (
        <>
          <div className="shrink-0 pl-2 pr-1">
            {isOwner || thread.slug.startsWith('_') ? (
              <ChatMenu thread={thread}>
                <IconButton variant="ghost">
                  <Icon className="size-6" />
                </IconButton>
              </ChatMenu>
            ) : (
              <IconButton variant="ghost" className="pointer-events-none">
                <Icon className="size-6" />
              </IconButton>
            )}
          </div>
          <div className="grow truncate text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
        </>
      )}

      <div className="shrink-0 gap-2 pl-1 pr-2 flex-end">
        {thread && (
          <>
            <NonSecureAdminRoleOnly>
              <FilterControl slug={thread.slug} />
            </NonSecureAdminRoleOnly>
            <VoiceoverAutoplayButton threadId={thread._id} />
            <IconButton
              variant="ghost"
              color="gray"
              onClick={() =>
                setChatState((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }))
              }
            >
              <Sidebar
                className="size-6 -scale-x-100"
                weight={chatState.sidebarOpen ? 'fill' : 'regular'}
              />
            </IconButton>
          </>
        )}

        {/* {closeChat && (
          <IconButton variant="ghost" color="gray" onClick={closeChat}>
            <X className="size-6" />
          </IconButton>
        )} */}
      </div>
    </div>
  )
}
