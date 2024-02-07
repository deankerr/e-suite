'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import { forwardRef } from 'react'
import { ThreadShell } from '../../components/threads/ThreadShell'

type Props = {}

export const ThreadsFeed = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ThreadsFeed({ className, ...props }, forwardedRef) {
    const threads = usePaginatedQuery(api.threads.list, {}, { initialNumItems: 10 })
    return (
      <ScrollArea>
        <div
          {...props}
          className={cn('space-y-rx-8 overflow-y-auto px-4 pb-28 pt-4', className)}
          ref={forwardedRef}
        >
          {threads.results.map((thread) => (
            <ThreadShell key={thread._id} threadId={thread._id} />
          ))}
          {!threads.results.length && <ThreadShell setTitle={'New Chat'} />}
        </div>
      </ScrollArea>
    )
  },
)
