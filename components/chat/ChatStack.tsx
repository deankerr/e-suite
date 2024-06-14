import { ChatBody } from '@/components/chat/ChatBody'
import { ChatContent } from '@/components/chat/ChatContent'
import { ChatFeed } from '@/components/chat/ChatFeed'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatProvider } from '@/components/chat/ChatProvider'
import { ChatShell } from '@/components/chat/ChatShell'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { MessageInput } from '@/components/message-input/MessageInput'
import { ClientOnly } from '@/components/util/ClientOnly'

const Component = (props: React.ComponentProps<typeof ChatShell>) => {
  return (
    <ChatShell {...props}>
      <ChatHeader />
      <ChatBody>
        <ChatSidebar />
        <ChatContent>
          <ChatFeed className="mx-auto max-w-3xl" />

          {/* input */}
          <ClientOnly>
            <MessageInput className="mx-auto max-w-3xl shrink-0" />
          </ClientOnly>
        </ChatContent>
      </ChatBody>
    </ChatShell>
  )
}

export const ChatStack = ({
  slug,
  onClose,
  ...props
}: {
  slug: string
  onClose?: (slug: string) => void
} & React.ComponentProps<typeof ChatShell>) => {
  return (
    <ChatProvider slug={slug} onClose={onClose}>
      <Component {...props} />
    </ChatProvider>
  )
}
