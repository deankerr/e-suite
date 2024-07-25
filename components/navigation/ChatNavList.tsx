'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { appConfig } from '@/config/config'
import { useUserThreadsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const ChatNavList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const segments = useSelectedLayoutSegments()
  const threads = useUserThreadsList()

  return (
    <div {...props} className={cn('flex grow flex-col gap-0.5 overflow-hidden', className)}>
      <div className="shrink-0 border-b border-grayA-5 px-3 text-sm font-semibold text-gray-11">
        Threads
      </div>

      <ScrollArea scrollbars="vertical">
        <div className="h-full space-y-1 px-2 py-1">
          {threads ? (
            threads.map((thread) => (
              <Link
                key={thread._id}
                href={`${appConfig.chatUrl}/${thread.slug}`}
                className={cn(
                  'rounded border border-transparent py-2 pl-2 pr-0 text-sm opacity-90',
                  'flex gap-2',
                  segments.includes(thread.slug)
                    ? 'border-accentA-7 bg-accentA-4 text-white opacity-100 shadow-glow'
                    : 'hover:border-accentA-6 hover:bg-accentA-3 hover:shadow-glow',
                )}
              >
                {thread.model?.type === 'chat' ? (
                  <Icons.Chat className="size-5 shrink-0 text-accent-11" />
                ) : (
                  <Icons.Images className="size-5 shrink-0 text-accent-11" />
                )}
                <div className="line-clamp-2">{thread.title ?? 'untitled'}</div>
              </Link>
            ))
          ) : (
            <div className="flex h-full">
              <LoadingSpinner className="m-auto block" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
