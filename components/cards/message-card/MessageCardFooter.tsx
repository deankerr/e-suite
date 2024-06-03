import { Inset } from '@radix-ui/themes'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageCardFooterProps = { message: EMessageWithContent } & React.ComponentProps<'div'>

export const MessageCardFooter = ({ message, className, ...props }: MessageCardFooterProps) => {
  const latestJob = message.jobs.at(-1)
  if (!latestJob) return null

  return (
    <Inset side="bottom" className="mt-3">
      <div
        {...props}
        className={cn(
          'gap-2 border-t bg-gray-2 px-2 py-1.5 font-mono text-xs text-gray-11 flex-start',
          className,
        )}
      >
        {latestJob.name}
        {latestJob.status === 'queued' && <LoadingSpinner variant="dots" className="w-4" />}
        {latestJob.status === 'active' && <LoadingSpinner variant="dots" className="w-4" />}

        {latestJob.status === 'failed' && (
          <div className="flex-none">
            <div className="flex items-center gap-1">
              <div className="text-red-10">✖</div>
              <div className="font-mono text-xs">{latestJob.errors?.at(-1)?.message}</div>
            </div>
          </div>
        )}

        {latestJob.status === 'complete' && (
          <div className="flex-none">
            <div className="flex items-center gap-1">
              <div className="text-green-10">✔</div>
              <div className="font-mono text-xs">
                {(((latestJob.endedTime ?? 0) - latestJob.queuedTime) / 1000).toFixed(2)}s
              </div>
            </div>
          </div>
        )}
      </div>
    </Inset>
  )
}
