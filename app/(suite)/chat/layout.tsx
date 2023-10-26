import { TabLink } from '@/components/tab-link'
import { chatsConfig } from '@/config/chats'
import { DotFilledIcon } from '@radix-ui/react-icons'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="main-content chat-layout-grid">
      <div className="chat-layout-tab-bar flex bg-muted">
        {chatsConfig.map((c) => (
          <TabLink
            key={c.id}
            href={`/chat/${c.name}`}
            className="flex h-full min-w-[9rem] items-center justify-between border-r border-r-border border-t-primary px-3 text-sm font-medium"
            activeClassName="border-t-2 bg-background"
          >
            <div className="px-1"></div>
            {c.name}
            <DotFilledIcon />
          </TabLink>
        ))}
      </div>
      {children}
    </main>
  )
}
