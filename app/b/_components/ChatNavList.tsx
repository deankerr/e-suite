'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

import { appConfig } from '@/app/b/config'
import { useUserThreadsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EThread } from '@/convex/types'

export const ChatNavList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const threads = useUserThreadsList()

  return (
    <div {...props} className={cn('flex grow flex-col gap-1 overflow-hidden', className)}>
      <div className="shrink-0 px-3 text-sm font-semibold text-gray-10">Threads</div>

      <ScrollArea scrollbars="vertical">
        <div className="flex flex-col gap-1 px-1">
          {threads?.map((thread) => <ChatNavLink key={thread._id} thread={thread} />)}
        </div>
      </ScrollArea>
    </div>
  )
}

export const ChatNavLink = ({
  thread,
  className,
  ...props
}: { thread: EThread } & React.ComponentProps<'a'>) => {
  const segments = useSelectedLayoutSegments()
  const isActive = segments.includes(thread.slug)

  const Icon = thread.model?.type === 'chat' ? Icons.Chat : Icons.ImagesSquare
  return (
    <Link
      href={`${appConfig.chatUrl}/${thread.slug}`}
      className={cn('flex rounded p-2', isActive ? 'bg-grayA-3' : 'hover:bg-grayA-2', className)}
      {...props}
    >
      <div className="shrink-0 pr-1.5 pt-0.5">
        <Icon className="size-4 text-gray-11" />
      </div>
      <div className="line-clamp-2 text-sm">{thread.title ?? 'untitled'}</div>
    </Link>
  )
}
