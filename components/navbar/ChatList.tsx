import { api } from '@/convex/_generated/api'
import { getAuthToken } from '@/lib/auth'
import { ScrollArea } from '@radix-ui/themes'
import { preloadQuery } from 'convex/nextjs'
import { ChatListItems } from './ChatListItems'

type ChatListProps = {} & React.ComponentProps<typeof ScrollArea>

export const ChatList = async ({ ...props }: ChatListProps) => {
  const token = await getAuthToken()
  const preloadedThreadList = await preloadQuery(api.threads.threads.list, {}, { token })

  return <ChatListItems preload={preloadedThreadList} {...props} />
}
