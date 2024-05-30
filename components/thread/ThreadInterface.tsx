import { useAtomValue } from 'jotai'

import { MessageCard } from '@/components/cards/MessageCard'
import { CommandMenu } from '@/components/thread/CommandMenu'
import { HeaderBar } from '@/components/thread/HeaderBar'
import { InputBar } from '@/components/thread/InputBar'
import { Spinner } from '@/components/ui/Spinner'
import { useThreadContent } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'
import type { PrimitiveAtom } from 'jotai'

type ThreadInterfaceProps = {
  threadId?: string
  threadAtom: PrimitiveAtom<EThreadWithContent>
  handleCloseThread: () => void
} & React.ComponentProps<'div'>

export const ThreadInterface = ({
  threadId,
  threadAtom,
  handleCloseThread,
  className,
  ...props
}: ThreadInterfaceProps) => {
  const threadFromQuery = useThreadContent(threadId)
  const threadFromAtom = useAtomValue(threadAtom)
  const thread = threadFromQuery ?? threadFromAtom

  return (
    <div {...props} className={cn('flex h-full flex-col overflow-y-auto', className)}>
      <div className="sticky top-0 z-10 h-16 shrink-0 border-b bg-gray-1">
        {thread && (
          <HeaderBar thread={thread} handleCloseThread={handleCloseThread}>
            <CommandMenu thread={thread} />
          </HeaderBar>
        )}
      </div>

      <div className="flex grow flex-col gap-4 p-3">
        {thread ? (
          thread.messages?.map((message) => (
            <MessageCard key={message._id} slug={thread.slug} message={message} />
          ))
        ) : (
          <Spinner className="m-auto" />
        )}
      </div>

      <div className="sticky bottom-0 z-10 min-h-16 border-t bg-gray-1">
        {thread && <InputBar thread={thread} />}
      </div>
    </div>
  )
}
