'use client'

import { useThread } from '@/app/(beta)/useThread'
import { CShell } from '@/app/components/ui/CShell'
import { IconButton } from '@/app/components/ui/IconButton'
import { TextArea } from '@/app/components/ui/TextArea'
import { Message } from '@/components/threads/Message'
import { Id } from '@/convex/_generated/dataModel'
import { ScrollArea, Text } from '@radix-ui/themes'
import { MessageSquareIcon, MessageSquareTextIcon, SendIcon } from 'lucide-react'
import { useState } from 'react'

const ThreadSlugPage = ({ params }: { params: { slug: [Id<'threads'>] } }) => {
  const [threadId] = params.slug
  const { thread, messages } = useThread({ id: threadId })

  const [messageValue, setMessageValue] = useState('')

  const ShellIcon = thread ? MessageSquareTextIcon : MessageSquareIcon
  return (
    <CShell.Root showLoadingState={!thread} className="h-full">
      <CShell.Section className="bg-panel-translucent">
        <CShell.Titlebar className="bg-gray-1" icon={<ShellIcon className="size-5 stroke-1" />}>
          <Text>{thread?.name ?? 'This thread is currently loading'}</Text>
        </CShell.Titlebar>

        <ScrollArea className="grow">
          <div className="flex flex-col justify-end divide-y">
            {messages.results.map((message) => (
              <Message key={message._id} message={message} onDelete={() => {}} onEdit={() => {}} />
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 px-1">
          <TextArea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
              }
            }}
            disabled={!thread?.owner.isViewer}
          />
          <IconButton
            variant="surface"
            disabled={!thread?.owner.isViewer || messageValue.length === 0}
          >
            <SendIcon />
          </IconButton>
        </div>
      </CShell.Section>

      <CShell.Section className="bg-gray-1" width={320} side="right">
        side
      </CShell.Section>
    </CShell.Root>
  )
}

export default ThreadSlugPage
