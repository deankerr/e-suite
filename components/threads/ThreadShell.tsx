import { IconButton } from '@/app/components/ui/IconButton'
import { TextArea } from '@/app/components/ui/TextArea'
import { useThread } from '@/components/threads/useThread'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs } from '@radix-ui/themes'
import { MessageSquareIcon, SendIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { CShell } from '../ui/CShell'
import { InferenceParametersForm } from './InferenceParametersForm'
import { Message } from './Message'

type ThreadShellProps = {
  threadId?: Id<'threads'>
} & React.ComponentProps<typeof CShell.Root>

export const ThreadShell = forwardRef<HTMLDivElement, ThreadShellProps>(function ThreadShell(
  { threadId, className, ...props },
  forwardedRef,
) {
  const { thread } = useThread({ threadId })
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
          <div className="divide-y">
            {thread?.messages.map((msg) => <Message key={msg._id} message={msg} />)}
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

      {/* rightbar */}
      <CShell.Sidebar side="right" open={menuOpen}>
        <CShell.Titlebar className="justify-between bg-gray-1A">
          <TabArea />
          <IconButton
            variant="ghost"
            className="mr-0.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <XIcon />
          </IconButton>
        </CShell.Titlebar>
        <InferenceParametersForm />
      </CShell.Sidebar>
    </CShell.Root>
  )
})

const TabArea = () => (
  <Tabs.Root>
    <Tabs.List>
      <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
      <Tabs.Trigger value="details">Details</Tabs.Trigger>
    </Tabs.List>
  </Tabs.Root>
)
