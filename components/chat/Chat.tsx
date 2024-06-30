import { Card, Inset } from '@radix-ui/themes'

import { ChatFeed } from '@/components/chat/ChatFeed'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatProvider } from '@/components/chat/ChatProvider'
import { Sidebar } from '@/components/chat/sidebars/Sidebar'
import { MessageFeed } from '@/components/message-feed/MessageFeed'
import { MessageInput } from '@/components/message-input/MessageInput'

const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="grid h-full w-full">
      <Inset side="all" className="flex flex-col">
        {children}
      </Inset>
    </Card>
  )
}

const Component = () => {
  return (
    <Shell>
      <ChatHeader />
      <div className="flex h-full overflow-hidden">
        <div className="flex h-full w-full flex-col overflow-hidden">
          {/* <ChatFeed /> */}
          <MessageFeed />
          <MessageInput />
        </div>
        <Sidebar />
      </div>
    </Shell>
  )
}

export const Chat = ({ slug, onClose }: { slug: string; onClose?: (slug: string) => void }) => {
  return (
    <ChatProvider slug={slug} onClose={onClose}>
      <Component />
    </ChatProvider>
  )
}
