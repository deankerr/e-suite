'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { appConfig } from '@/config/config'
import { useThreadsList } from '@/lib/api'
import { cn } from '@/lib/utils'

export const ThreadsList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const segments = useSelectedLayoutSegments()
  const threads = useThreadsList()
  const [containerRef] = useAutoAnimate()

  const modelTypeIcons = {
    chat: Icons.Chat,
    image: Icons.Images,
  } as const

  const linkClassNames = cn(
    'rounded border border-transparent text-sm font-medium opacity-90',
    'flex gap-2 py-2 px-2',
    'hover:bg-gray-2',
  )

  const activeClassNames = 'bg-gray-2 border-grayA-5 opacity-100'

  if (threads.length === 0) return null

  return (
    <div {...props} className={cn('flex grow flex-col gap-0.5 overflow-hidden', className)}>
      <div className="shrink-0 border-b border-gray-5 px-3 text-sm font-semibold text-gray-11">
        Threads
      </div>

      <ScrollArea scrollbars="vertical">
        <div ref={containerRef} className="h-full space-y-1 px-2.5 py-1">
          {threads
            ? threads.map((thread) => {
                const IconComponent = modelTypeIcons.chat
                const isActive = segments.includes(thread.slug)

                return (
                  <Link
                    key={thread._id}
                    href={`${appConfig.threadUrl}/${thread.slug}`}
                    className={cn(linkClassNames, isActive && activeClassNames)}
                  >
                    <IconComponent className="size-5 shrink-0 text-accentA-11" />
                    <div className="line-clamp-2 select-none">{thread.title ?? 'untitled'}</div>
                  </Link>
                )
              })
            : null}

          {threads === undefined && (
            <div className="flex h-full">
              <LoadingSpinner className="m-auto block" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
