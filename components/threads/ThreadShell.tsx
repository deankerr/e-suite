import { IconButton } from '@/app/components/ui/IconButton'
import { useThread } from '@/components/threads/useThread'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs } from '@radix-ui/themes'
import { MessageSquareIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { CShell } from '../ui/CShell'
import { InferenceParameterControls } from './InferenceParameterControls'
import { Message } from './Message'
import { MessageInput } from './MessageInput'

type ThreadShellProps = {
  threadId?: Id<'threads'>
} & React.ComponentProps<typeof CShell.Root>

export const ThreadShell = forwardRef<HTMLDivElement, ThreadShellProps>(function ThreadShell(
  { threadId, className, ...props },
  forwardedRef,
) {
  const { thread, send, threadAtoms } = useThread({ threadId })
  const title = thread ? thread.name : threadId ? 'Loading...' : 'No Thread ID'

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <CShell.Root {...props} className={cn('bg-gray-1', className)} ref={forwardedRef}>
      {/* content */}
      <CShell.Content>
        <CShell.Titlebar className="justify-between">
          <div className="flex items-center">
            <IconButton lucideIcon={MessageSquareIcon} variant="ghost" className="m-0" />
            <Heading size="2">{title}</Heading>
          </div>

          <IconButton
            variant="ghost"
            className="mr-0.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <SlidersHorizontalIcon />
          </IconButton>
        </CShell.Titlebar>

        {/* message feed */}
        <ScrollArea>
          <div className="flex flex-col-reverse">
            {thread?.messages.map((msg) => <Message key={msg._id} message={msg} />)}
          </div>
        </ScrollArea>

        <MessageInput inputAtom={threadAtoms.message} onSend={send} />
      </CShell.Content>

      {/* rightbar */}
      <CShell.Sidebar side="right" open={menuOpen}>
        <Tabs.Root defaultValue="parameters">
          <Tabs.List>
            <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <div className="ml-auto grid place-content-center p-1">
              <IconButton
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <XIcon />
              </IconButton>
            </div>
          </Tabs.List>

          <Tabs.Content value="parameters">
            <InferenceParameterControls threadAtoms={threadAtoms} />
          </Tabs.Content>
        </Tabs.Root>
      </CShell.Sidebar>
    </CShell.Root>
  )
})
