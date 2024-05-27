'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'

import { ThreadView } from '@/app/multi/[[...slug]]/ThreadView'
import { cn } from '@/lib/utils'

type MultiThreadViewerProps = { slug?: [threadIds: string] } & React.ComponentProps<'div'>
// grid auto-cols-[min(100vw,28rem)] grid-flow-col
export const MultiThreadViewer = ({ slug, className, ...props }: MultiThreadViewerProps) => {
  const threadIds = slug?.[0].split('-') ?? []
  const [parent] = useAutoAnimate(/* optional config */)
  return (
    <div
      {...props}
      className={cn(
        'flex h-[calc(100svh-2.75rem)] max-h-full divide-x overflow-x-auto overflow-y-hidden',
        className,
      )}
      ref={parent}
    >
      {threadIds.map((slug) => (
        <ThreadView key={slug} slug={[slug]} />
      ))}
      <ThreadView />
    </div>
  )
}
