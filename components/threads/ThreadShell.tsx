import { Button } from '@/app/components/ui/Button'
import { IconButton } from '@/app/components/ui/IconButton'
import { useThread } from '@/components/threads/useThread'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, Tabs } from '@radix-ui/themes'
import { MessageSquareIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { CShell } from '../ui/CShell'
import { InferenceParameterControls } from './InferenceParameterControls'
import { MessageFeed } from './MessageFeed'
import { MessageInput } from './MessageInput'
import { RemoveThreadDialog } from './RemoveThreadDialog'

type ThreadShellProps = {
  threadId?: Id<'threads'>
} & React.ComponentProps<typeof CShell.Root>

export const ThreadShell = forwardRef<HTMLDivElement, ThreadShellProps>(function ThreadShell(
  { threadId, className, ...props },
  forwardedRef,
) {
  const { thread, send, threadAtoms } = useThread({ threadId })
  const title = thread ? thread.title : threadId ? 'Loading...' : 'No Thread ID'

  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => console.log('render thread shell'))

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

        <MessageFeed messages={thread?.messages ?? []} />

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

          <Tabs.Content value="details">
            <div className="flex flex-col justify-center p-4">
              {thread && thread.owner.isViewer ? (
                <RemoveThreadDialog id={thread._id} onDelete={() => {}}>
                  <Button color="red">Delete Thread</Button>
                </RemoveThreadDialog>
              ) : null}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </CShell.Sidebar>
    </CShell.Root>
  )
})

export const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
