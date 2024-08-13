'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'

import { sidebarOpenAtom } from '@/components/layout/atoms'
import { NavLink } from '@/components/navigation/NavLink'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useThreads } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'
import { cn } from '@/lib/utils'

export const ThreadsList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const path = useSuitePath()
  const toggleSidebar = useSetAtom(sidebarOpenAtom)
  const { threadsList } = useThreads()
  const [containerRef] = useAutoAnimate()

  if (threadsList.length === 0) return null

  return (
    <div {...props} className={cn('flex grow flex-col gap-0.5 overflow-hidden', className)}>
      <div className="shrink-0 border-b border-gray-5 px-3 text-sm font-semibold text-gray-11">
        Threads
      </div>

      <ScrollArea scrollbars="vertical">
        <div ref={containerRef} className="h-full space-y-1 px-2.5 py-1">
          {threadsList
            ? threadsList.map((thread) => {
                const IconComponent = getIcon(thread.latestRunConfig?.type)
                const isActive = path.slug === thread.slug

                if (thread.slug === 'new') return null
                return (
                  <NavLink
                    key={thread._id}
                    href={path.toThread(thread.slug)}
                    aria-current={isActive && 'page'}
                    onClick={() => toggleSidebar(false)}
                  >
                    <IconComponent size={18} className="text-accentA-11" />
                    <div className="line-clamp-2 select-none">{thread.title ?? 'untitled'}</div>
                  </NavLink>
                )
              })
            : null}

          {threadsList === undefined && (
            <div className="flex h-full">
              <LoadingSpinner className="m-auto block" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

const getIcon = (type = '') => {
  const modelTypeIcons: Record<string, React.ComponentType<React.ComponentProps<'svg'>>> = {
    chat: Icons.Chat,
    textToImage: Icons.Images,
  }

  return modelTypeIcons[type] ?? Icons.Moon
}
