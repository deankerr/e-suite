'use client'

import { forwardRef } from 'react'
import { Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ImageIcon, MenuIcon, MessageSquareIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useAppStore } from '../providers/AppStoreProvider'
import { VoiceoverPlayToggle } from '../threads/VoiceoverPlayToggle'
import { UIIconButton } from './UIIconButton'

type TopBarProps = {
  overrideTitle?: string
} & React.ComponentProps<'div'>

export const TopBar = forwardRef<HTMLDivElement, TopBarProps>(function TopBar(
  { overrideTitle, className, ...props },
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
    return title
  }

  const getGenerationTitle = () => {
    const generation = generationsList?.find(({ _id }) => _id === slug)
    const title = generation?.images?.[0]?.parameters?.prompt
    return title
  }

  const routeIcons = {
    chat: <MessageSquareIcon />,
    generate: <ImageIcon />,
  } as Record<string, React.ReactNode>

  const icon = routePath && routeIcons[routePath]

  const title = route.chat ? getThreadTitle() : route.generate ? getGenerationTitle() : null

  return (
    <div
      {...props}
      className={cn('flex-between h-[--e-top-h] shrink-0 border-b bg-gray-1 px-4', className)}
      ref={forwardedRef}
    >
      {/* start */}
      <div className="flex-between shrink-0 gap-3 md:grow md:gap-4">
        <UIIconButton
          variant="ghost"
          label="toggle navigation bar"
          onClick={toggleNavigationSidebar}
        >
          <MenuIcon className="scale-[1.2]" />
        </UIIconButton>

        {icon}
      </div>

      {/* middle */}
      <Heading className="line-clamp-2 max-h-full px-1 text-center md:px-2.5" size="3">
        {overrideTitle ?? title}
      </Heading>

      {/* end */}
      <div className="flex-end shrink-0 gap-3 md:grow md:gap-4">
        {route.chat ? <VoiceoverPlayToggle /> : <div className="w-[24px]"></div>}
        {!route.home && (
          <UIIconButton variant="ghost" label="toggle parameters sidebar" onClick={toggleSidebar}>
            {sidebarOpen ? <XIcon /> : <SlidersHorizontalIcon />}
          </UIIconButton>
        )}
      </div>
    </div>
  )
})
