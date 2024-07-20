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
        <div className="space-y-2 px-2">
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

  const Icon = thread.model?.type === 'chat' ? Icons.Chat : Icons.Images
  return (
    <Link
      href={`${appConfig.chatUrl}/${thread.slug}`}
      className={cn(
        'line-clamp-2 rounded border border-transparent px-2 py-1 text-sm',
        isActive ? 'bg-accentA-6' : 'hover:border-accentA-3 hover:bg-accentA-3',
      )}
      {...props}
    >
      <Icon className="mr-1 inline-block text-accent-11" />
      {thread.title ?? 'untitled'}
    </Link>
  )
}
