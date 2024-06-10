'use client'

import { useState } from 'react'
import { Button, Card, IconButton, Inset } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'
import { CodeIcon, FileWarningIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

import { ChatInput } from '@/components/chat/ChatInput'
import { Chat2Menu } from '@/components/chat/ChatMenu'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { ChatProvider, useChat } from '@/components/chat/ChatProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Pre } from '@/components/util/Pre'
import { commandMenuOpenAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

type ChatProps = { slug: string } & React.ComponentProps<'div'>

const ChatComponent = ({ className, ...props }: ChatProps) => {
  const { thread } = useChat()
  const setMenuOpen = useSetAtom(commandMenuOpenAtom)
  const [showJson, setShowJson] = useState(false)
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
        {thread === null && (
          <div className="grow truncate flex-center">
            <FileWarningIcon className="text-red-11" />
          </div>
        )}
        {thread === undefined && <LoadingSpinner />}

        <div className="shrink-0 gap-2 flex-end">
          <IconButton variant="ghost" color="gray" className="shrink-0" size="1">
            <XIcon />
          </IconButton>
        </div>
      </Inset>

      {/* header 2 */}
      <Inset side="x" className="h-10 shrink-0 border-b px-2 text-sm flex-between">
        <div className="w-14 flex-start">
          {/* show json button */}
          <IconButton
            variant="ghost"
            color="gray"
            size="1"
            className="shrink-0"
            onClick={() => setShowJson(!showJson)}
          >
            <CodeIcon />
          </IconButton>
        </div>

        {/* chat menu button */}
        {thread && <Chat2Menu thread={thread} />}

        <div className="w-14 pr-1 flex-end">
          {/* slug page link */}
          <Button variant="ghost" color="gray" size="1" className="shrink-0" asChild>
            <Link href={`/c/${thread?.slug}`}>{thread?.slug}</Link>
          </Button>
        </div>
      </Inset>

      {/* body */}
      <div className="grow overflow-hidden">
        {thread && !showJson && <ChatMessages thread={thread} />}
        {showJson && <Pre>{JSON.stringify(thread, null, 2)}</Pre>}
      </div>

      {/* footer */}
      <Inset side="bottom" className="min-h-10 shrink-0 border-t px-1 text-sm flex-between">
        {thread && <ChatInput className="mx-auto max-w-3xl" thread={thread} />}
      </Inset>
    </Card>
  )
}

export const Chat = (props: ChatProps) => {
  return (
    <ChatProvider slug={props.slug}>
      <ChatComponent {...props} />
    </ChatProvider>
  )
}
