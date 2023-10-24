import { chatsConfig } from '@/config/chats'
import { TabLink } from '../tab-link'

type Props = {
  children: React.ReactNode
}

export default function ChatLayout({ children }: Props) {
  return (
    <>
      <div className="flex h-10 bg-muted">
        {chatsConfig.map((c) => (
          <TabLink
            key={c.id}
            href={`/chat/${c.name}`}
            className="flex h-full items-center justify-between border-primary px-3 text-sm font-medium"
            activeClassName="border-t-2 bg-background"
          >
            {c.name}
          </TabLink>
        ))}
      </div>
      <div>{children}</div>
    </>
  )
}
