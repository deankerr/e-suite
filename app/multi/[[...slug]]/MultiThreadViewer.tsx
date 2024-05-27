import { ThreadView } from '@/app/multi/[[...slug]]/ThreadView'
import { ThreadViewNew } from '@/app/multi/[[...slug]]/ThreadViewNew'
import { cn } from '@/lib/utils'

type MultiThreadViewerProps = { slug: [threadIds: string] } & React.ComponentProps<'div'>

export const MultiThreadViewer = ({ slug, className, ...props }: MultiThreadViewerProps) => {
  const threadIds = slug[0].split('_')
  return (
    <div
      {...props}
      className={cn(
        'grid h-[calc(100svh-2.75rem-1px)] max-h-full auto-cols-[28rem] grid-flow-col divide-x overflow-x-auto overflow-y-hidden bg-overlay',
        className,
      )}
    >
      <ThreadViewNew />
      {threadIds.map((slug) => (
        <ThreadView key={slug} slug={[slug]} />
      ))}
    </div>
  )
}
