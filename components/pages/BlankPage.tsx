import * as Icons from '@phosphor-icons/react/dist/ssr'

import { NavSheet } from '@/app/NavRail'
import { AppLogo } from '@/components/icons/AppLogo'
import { IconButton } from '@/components/ui/Button'

export const BlankPage = () => {
  return (
    <div className="flex-col-center h-full w-full bg-gray-1">
      <AppLogo className="size-48 text-gray-3" />
      <NavSheet>
        <IconButton
          variant="ghost"
          aria-label="Open navigation sheet"
          className="absolute left-1 top-1 md:hidden"
        >
          <Icons.List size={20} />
        </IconButton>
      </NavSheet>
    </div>
  )
}
