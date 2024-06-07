import { Button, Card, IconButton, Inset } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'
import { MenuIcon, XIcon } from 'lucide-react'

import { ChatInput } from '@/components/chat/chat-input/ChatInput'
import { ChatViewApiProvider } from '@/components/chat/ChatApiProvider'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { TempChatMenu } from '@/components/chat/TempChatMenu'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { commandMenuOpenAtom } from '@/lib/atoms'
import { useModelData } from '@/lib/hooks'
import { cn, getThreadConfig } from '@/lib/utils'

import type { E_Thread } from '@/convex/shared/types'

type ChatProps = { thread: E_Thread | null | undefined } & React.ComponentProps<typeof Card>

const ChatComponent = ({ thread, className, ...props }: ChatProps) => {
  const setMenuOpen = useSetAtom(commandMenuOpenAtom)
  const { getModel } = useModelData()
  const config = getThreadConfig(thread)
  const currentModel = thread ? getModel(config.current.endpoint, config.current.model) : null

  return (
    <Card
      {...props}
      className={cn('card-bg-1 flex h-full w-full flex-col overflow-hidden', className)}
    >
      {/* header */}
      <Inset side="top" className="h-10 shrink-0 border-b border-gray-5 px-2 text-sm flex-between">
        <div className="shrink-0 flex-start">
          <IconButton
            variant="ghost"
            className="shrink-0"
            size="1"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </div>

        {thread && <div className="grow truncate flex-center">{thread?.title ?? 'new thread'}</div>}
        {thread === undefined && <LoadingSpinner />}

        <div className="shrink-0 gap-2 flex-end">
          <IconButton variant="ghost" color="gray" className="shrink-0" size="1">
            <XIcon />
          </IconButton>
        </div>
      </Inset>

      {/* header 2 */}
      <Inset side="x" className="h-10 shrink-0 border-b px-1 text-sm flex-between">
        <div className="w-14"></div>
        {thread && (
          <TempChatMenu thread={thread}>
            <Button variant="surface" size="1">
              {currentModel?.name}
            </Button>
          </TempChatMenu>
        )}
        {thread && (
          <div className="w-14 shrink-0 text-xs text-gray-10 flex-start">{thread.slug}</div>
        )}
      </Inset>

      {/* body */}
      <div className="grow overflow-hidden">{thread && <ChatMessages thread={thread} />}</div>

      {/* footer */}
      <Inset side="bottom" className="min-h-10 shrink-0 border-t px-1 text-sm flex-between">
        {thread && <ChatInput className="mx-auto max-w-3xl" thread={thread} />}
      </Inset>
    </Card>
  )
}

export const Chat = (props: ChatProps) => {
  const threadId = props.thread?._id ?? ''
  const slug = props.thread?.slug ?? ''
  return (
    <ChatViewApiProvider threadId={threadId} slug={slug}>
      <ChatComponent {...props} />
    </ChatViewApiProvider>
  )
}
