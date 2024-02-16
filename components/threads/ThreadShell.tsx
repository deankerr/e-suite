import { IconButton } from '@/app/components/ui/IconButton'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { MessageSquareIcon, PanelRightOpenIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { CShell } from '../ui/CShell'

type ThreadShellProps = {
  threadId?: Id<'threads'>
}

export const ThreadShell = forwardRef<
  HTMLDivElement,
  ThreadShellProps & React.ComponentProps<typeof CShell.Root>
>(function ThreadShell({ className, ...props }, forwardedRef) {
  return (
    <CShell.Root {...props} className={cn('', className)} ref={forwardedRef}>
      <CShell.LeftSidebar>L</CShell.LeftSidebar>
      <CShell.Content>
        <div className="flex h-10 items-center justify-between border-b">
          <IconButton variant="ghost" className="m-0">
            <MessageSquareIcon className="stroke-1" />
          </IconButton>
          <IconButton variant="ghost" className="m-0">
            <PanelRightOpenIcon className="stroke-1" />
          </IconButton>
        </div>
      </CShell.Content>
      <CShell.RightSidebar></CShell.RightSidebar>
    </CShell.Root>
  )
})
