import { getSession } from '@/lib/server'
import { cn } from '@/lib/utils'
import theSun from '/assets/icons/sun-white.svg'
import Image from 'next/image'
import { AppLogoTitle } from './app-logo-title'
import { NavTree } from './nav-tree'
import { ThemeToggle } from './ui/theme-toggle'
import { UserMenuButton } from './user-menu-button'

export async function AppSidebar({ className }: React.ComponentProps<'div'>) {
  const session = await getSession()
  return (
    <div className={cn('flex flex-col items-center gap-4 py-4', className)}>
      <AppLogoTitle className="pr-6" />
      <NavTree className="w-60" />
      <Image src={theSun} alt="sun" className="w-52 max-w-[13rem] grow opacity-10" priority />
      <div className="flex items-center justify-between gap-4">
        <UserMenuButton session={session} />
        <ThemeToggle />
      </div>
    </div>
  )
}
