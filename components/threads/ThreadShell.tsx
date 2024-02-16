import { IconButton } from '@/app/components/ui/IconButton'
import { TextArea } from '@/app/components/ui/TextArea'
import { useThread } from '@/components/threads/useThread'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { MessageSquareIcon, SendIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { CShell } from '../ui/CShell'
import { Message } from './Message'

type ThreadShellProps = {
  threadId?: Id<'threads'>
}

export const ThreadShell = forwardRef<
  HTMLDivElement,
  ThreadShellProps & React.ComponentProps<typeof CShell.Root>
>(function ThreadShell({ threadId, className, ...props }, forwardedRef) {
  const { thread } = useThread({ threadId })

  const title = thread ? thread.name : threadId ? 'Loading...' : 'No Thread ID'
  return (
    <CShell.Root {...props} className={cn('', className)} ref={forwardedRef}>
      <CShell.Content
        titlebar={
          <>
            <IconButton lucideIcon={MessageSquareIcon} variant="ghost" className="m-0" />
            <Heading size="2">{title}</Heading>
            <div className="grow" />
          </>
        }
      >
        {/* message feed */}
        <ScrollArea className="grow">
          <div className="flex flex-col justify-end divide-y">
            {thread?.messages.map((msg) => (
              <Message key={msg._id} message={msg} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </ScrollArea>

        {/* message input */}
        <div className="flex min-h-16 items-center gap-2">
          <TextArea minRows={2} />
          <IconButton variant="surface">
            <SendIcon />
          </IconButton>
        </div>
      </CShell.Content>

      <CShell.RightSidebar>r</CShell.RightSidebar>
    </CShell.Root>
  )
})
