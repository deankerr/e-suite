'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import { forwardRef } from 'react'
import { ThreadShell } from '../../components/threads/ThreadShell'
import { Button } from '../ui/Button'
import { DebugEntityInfo } from '../util/DebugEntityInfo'

type Props = {}

export const ThreadsFeed = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function ThreadsFeed({ className, ...props }, forwardedRef) {
    const threads = usePaginatedQuery(api.threads.list, {}, { initialNumItems: 10 })

    return (
      <ScrollArea>
        <div {...props} className={cn('space-y-4 p-1 md:p-6', className)} ref={forwardedRef}>
          {threads.results.map((thread) => (
            <ThreadShell key={thread._id} threadId={thread._id} />
          ))}
          {!threads.results.length && <ThreadShell setTitle={'New Chat'} />}
        </div>
        <div className="mx-auto w-fit">
          <Button disabled={threads.status !== 'CanLoadMore'} onClick={() => threads.loadMore(4)}>
            Load more
          </Button>
        </div>
        <DebugEntityInfo values={[threads.results.length, threads.status]} />
      </ScrollArea>
    )
  },
)
