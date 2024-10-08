import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toggle from '@radix-ui/react-toggle'

import { Navigation } from '@/components/navigation/Navigation'

export const NavigationRail = () => {
  return (
    <div className="z-20 hidden w-11 shrink-0 md:block [&:has(button[data-state=on])]:w-60">
      <Navigation className="w-11 rounded-md border transition-all hover:w-60 [&:has(button[data-state=on])]:w-60">
        <Toggle.Root className="absolute left-48 top-1 z-10 flex size-10 items-center justify-center rounded text-gray-11 outline-accentA-8 hover:bg-grayA-2 data-[state=on]:text-accent-11">
          <Icons.SidebarSimple size={24} />
        </Toggle.Root>
      </Navigation>
    </div>
  )
}
