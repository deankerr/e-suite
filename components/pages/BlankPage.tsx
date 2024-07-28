import { AppLogo } from '@/components/icons/AppLogo'
import { SidebarButton } from '@/components/layout/SidebarButton'

export const BlankPage = () => {
  return (
    <div className="flex-col-center h-full w-full bg-gray-1">
      <SidebarButton className="absolute left-1 top-1 md:hidden" />
      <AppLogo className="size-48 text-gray-3" />
    </div>
  )
}
