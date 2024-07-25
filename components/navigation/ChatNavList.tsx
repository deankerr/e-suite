'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
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

  const modelTypeIcons = {
    chat: Icons.Chat,
    image: Icons.Images,
  } as const

  const linkClassNames = cn(
    'rounded border border-transparent py-2 pl-2 pr-1 text-sm opacity-90',
    'flex gap-2',
    'hover:border-accentA-5 hover:bg-accentA-3 hover:shadow-glow',
  )

  const activeClassNames =
    'border-accentA-7 bg-accentA-3 text-accent-12 opacity-100 shadow-glow [&>svg]:text-accentA-11'

  const [containerRef] = useAutoAnimate()
  return (
    <div {...props} className={cn('flex grow flex-col gap-0.5 overflow-hidden', className)}>
      <div className="shrink-0 border-b border-grayA-5 px-3 text-sm font-semibold text-gray-11">
        Threads
      </div>

      <ScrollArea scrollbars="vertical">
        <div ref={containerRef} className="h-full space-y-1 px-2.5 py-1">
          {threads ? (
            threads.map((thread) => {
              const IconComponent = modelTypeIcons[thread.model?.type ?? 'chat']
              const isActive = segments.includes(thread.slug)

              return (
                <Link
                  key={thread._id}
                  href={`${appConfig.chatUrl}/${thread.slug}`}
                  className={cn(linkClassNames, isActive && activeClassNames)}
                >
                  <IconComponent className="size-5 shrink-0 text-accentA-9" />
                  <div className="line-clamp-2 select-none">{thread.title ?? 'untitled'}</div>
                </Link>
              )
            })
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
