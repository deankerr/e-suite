import { IconButton, Inset } from '@radix-ui/themes'
import { MessagesSquareIcon, XIcon } from 'lucide-react'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

import type { EThreadWithContent } from '@/convex/shared/structures'

type HeaderProps = { thread: EThreadWithContent | null | undefined } & React.ComponentProps<
  typeof Inset
>

export const Header = ({ thread, children, ...props }: HeaderProps) => {
  return (
    <Inset side="top" {...props}>
      <div className="h-10 border-b px-1 text-sm flex-between">
        <div className="shrink-0 flex-start">
          <IconButton variant="ghost" className="m-0 shrink-0">
            <MessagesSquareIcon className="size-4" />
          </IconButton>
        </div>

        {thread && <div className="grow truncate flex-start">{thread?.title ?? 'new thread'}</div>}
        {thread && <div className="shrink-0 text-xs text-gray-10 flex-start">{thread.slug}</div>}
        {thread === undefined && <LoadingSpinner />}
        {children}

        <div className="shrink-0 gap-2 flex-end">
          <IconButton variant="ghost" className="m-0 shrink-0">
            <XIcon className="size-5" />
          </IconButton>
        </div>
      </div>
    </Inset>
  )
}
