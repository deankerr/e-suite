'use client'

import { PermissionsCard } from '@/app/components/PermissionsCard'
import { IconButton } from '@/app/components/ui/IconButton'
import { Label } from '@/app/components/ui/Label'
import { TextArea } from '@/app/components/ui/TextArea'
import { Message } from '@/components/threads/Message'
import { useThread } from '@/components/threads/useThread'
import { CShell } from '@/components/ui/CShell'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { ScrollArea, Text, TextFieldInput } from '@radix-ui/themes'
import { MessageSquareIcon, MessageSquareTextIcon, SendIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { InferenceParametersForm } from './InferenceParametersForm'

type ThreadCShellProps = {
  threadId: Id<'threads'>
}

export const ThreadCShell = forwardRef<
  HTMLDivElement,
  ThreadCShellProps & React.ComponentProps<'div'>
>(function ThreadCShell({ threadId, className, ...props }, forwardedRef) {
  const { thread } = useThread({ threadId: threadId })
  const messages = { results: thread?.messages }
  const [messageValue, setMessageValue] = useState('')

  const ShellIcon = thread ? MessageSquareTextIcon : MessageSquareIcon

  return (
    <CShell.Root {...props} className={cn('', className)} ref={forwardedRef}>
      <CShell.Section className="bg-panel-translucent">
        <CShell.Titlebar className="bg-gray-1" icon={<ShellIcon className="size-5 stroke-1" />}>
          <Text>{thread?.name ?? 'This thread is currently loading'}</Text>
        </CShell.Titlebar>

        <ScrollArea className="grow">
          <div className="flex flex-col justify-end divide-y">
            {messages.results?.map((message) => (
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

      <CShell.Section className="bg-gray-1" width={384} side="right">
        <CShell.Titlebar>Parameters</CShell.Titlebar>
        <PermissionsCard permissions={{ private: true }} onPermissionsChange={() => {}} />

        <div className="">
          <Label>System prompt</Label>
          <TextArea className="sm:text-sm" minRows={3} maxRows={6} />
        </div>

        <div className="">
          <Label>Name</Label>
          <TextFieldInput />
        </div>

        <InferenceParametersForm onSubmitSuccess={() => {}} />
      </CShell.Section>
    </CShell.Root>
  )
})
