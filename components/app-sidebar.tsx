import { Session } from '@/lib/server'
import { cn } from '@/lib/utils'
import theSun from '/assets/icons/sun-white.svg'
import Image from 'next/image'
import { NavTree } from './suite/nav-tree'
import { SuiteAppTitle } from './suite/suite-app-title'
import { ThemeToggle } from './ui/theme-toggle'
import { UserMenuButton } from './user-menu-button'

export function AppSidebar({
  session,
  className,
}: { session: Session } & React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col items-center gap-4 py-4', className)}>
      <SuiteAppTitle className="pr-6" />
      <NavTree className="w-60" />
      <Image src={theSun} alt="sun" className="w-52 max-w-[13rem] grow opacity-10" priority />
      <div className="flex items-center justify-between gap-4">
        <UserMenuButton session={session} />
        <ThemeToggle />
      </div>
    </div>
  )
}
