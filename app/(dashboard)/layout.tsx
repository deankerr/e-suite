import sunDiag from '@/assets/icons/sun-diag.svg'
import { AppLogoTitle } from '@/components/app-logo-title'
import { AppShell } from '@/components/app-shell'
import { AppSidebar } from '@/components/app-sidebar'
import { NavTree } from '@/components/nav-tree'
import { SidebarNav } from '@/components/sidebar-nav'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserMenuButton } from '@/components/user-menu-button'
import Image from 'next/image'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <AppSidebar className="">
        <AppLogoTitle className="pr-6" />
        <SidebarNav />
        <Image src={sunDiag} alt="sun" className="w-52 max-w-[13rem] grow opacity-30" priority />
        <div className="flex items-center justify-between gap-4">
          <UserMenuButton />
          <ThemeToggle />
        </div>
      </AppSidebar>
      {children}
    </AppShell>
  )
}
