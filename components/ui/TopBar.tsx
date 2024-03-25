'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { ImageIcon, MenuIcon, MessageSquareIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'
import { VoiceoverPlayToggle } from '../threads/VoiceoverPlayToggle'
import { UIIconButton } from './UIIconButton'

type TopBarProps = {} & React.ComponentProps<'div'>

export const TopBar = forwardRef<HTMLDivElement, TopBarProps>(function TopBar(
  { className, ...props },
  forwardedRef,
) {
  const toggleNavigationSidebar = useAppStore((state) => state.toggleNavigationSidebar)

  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  const threadsList = useQuery(api.threads.threads.list, {})
  const generationsList = useQuery(api.generations.do.list, {})

  const pathname = usePathname()
  const [_, routePath, slug] = pathname.split('/')

  const route = {
    home: !routePath,
    chat: routePath === 'chat',
    generate: routePath === 'generate',
  }

  const getThreadTitle = () => {
    const title = threadsList?.find(({ _id }) => _id === slug)?.title
    return {
      title: title ?? 'New Chat',
      icon: <MessageSquareIcon className="size-5 shrink-0" />,
    }
  }

  const getGenerationTitle = () => {
    const generation = generationsList?.find(({ _id }) => _id === slug)
    const title = generation?.images?.[0]?.parameters?.prompt
    return { title: title ?? 'New Generation', icon: <ImageIcon className="size-5 shrink-0" /> }
  }

  const { title, icon } = route.chat
    ? getThreadTitle()
    : route.generate
      ? getGenerationTitle()
      : { title: null, icon: null }

  return (
    <div
      {...props}
      className={cn('flex h-[--e-top-h] shrink-0 items-center border-b bg-gray-1 px-4', className)}
      ref={forwardedRef}
    >
      {/* start */}
      <div className="min-w-fit max-w-16 grow">
        <UIIconButton
          variant="ghost"
          label="toggle navigation bar"
          onClick={toggleNavigationSidebar}
        >
          <MenuIcon className="scale-[1.2]" />
        </UIIconButton>
      </div>

      {/* middle */}
      <div className="grow truncate px-1 text-center [&_>_svg]:inline">
        {icon} {title}
      </div>

      {/* end */}
      <div className="flex min-w-fit max-w-16 grow justify-end gap-3 md:gap-4">
        {route.chat && <VoiceoverPlayToggle />}
        {!route.home && (
          <UIIconButton variant="ghost" label="toggle parameters sidebar" onClick={toggleSidebar}>
            {sidebarOpen ? <XIcon /> : <SlidersHorizontalIcon />}
          </UIIconButton>
        )}
      </div>
    </div>
  )
})
