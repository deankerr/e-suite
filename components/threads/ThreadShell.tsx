import { IconButton } from '@/app/components/ui/IconButton'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { MessageSquareIcon } from 'lucide-react'
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
      <CShell.LeftSidebar></CShell.LeftSidebar>
      <CShell.Content
        titlebar={<IconButton lucideIcon={MessageSquareIcon} variant="ghost" className="m-0" />}
      ></CShell.Content>
      <CShell.RightSidebar></CShell.RightSidebar>
    </CShell.Root>
  )
})
