'use client'

import { ThreadContainer } from '@/app/t/[[...slug]]/thread-view/ThreadContainer'
import { cn } from '@/lib/utils'

type MultiThreadViewerProps = { slug?: [threadIds: string] } & React.ComponentProps<'div'>

export const MultiThreadViewer = ({ slug, className, ...props }: MultiThreadViewerProps) => {
  const threadIds = slug?.[0].split('-') ?? ['new']
  return (
    <div
      {...props}
      className={cn(
        'flex h-[calc(100svh-2.75rem)] max-h-full divide-x overflow-x-auto overflow-y-hidden',
        className,
      )}
    >
      {threadIds.map((id) => (
        <ThreadContainer key={id} threadId={id} />
      ))}
    </div>
  )
}
