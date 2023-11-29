import sunDiag from '@/assets/icons/sun-diag.svg'
import { AppLogoTitle } from '@/components/app-logo-title'
import { AppShell } from '@/components/app-shell'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarNav } from '@/components/sidebar-nav'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserMenuButton } from '@/components/user-menu-button'
import { getSession } from '@/lib/server'
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import Image from 'next/image'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  return (
    <AppShell>
      <AppSidebar>
        <AppLogoTitle className="pr-6" />
        {session ? (
          <>
            <SidebarNav />
            <Image
              src={sunDiag}
              alt="sun"
              className="w-52 max-w-[13rem] grow opacity-30"
              priority
            />
            <div className="flex items-center justify-between gap-4">
              <UserMenuButton />
              <ThemeToggle />
            </div>
          </>
        ) : (
          <>
            <div className="flex grow flex-col items-center justify-center gap-8">
              <Button variant="default">
                <LoginLink>Log In</LoginLink>
              </Button>
              <Button variant="default">
                <RegisterLink>Sign Up</RegisterLink>
              </Button>
            </div>

            <ThemeToggle />
          </>
        )}
        <LoginLink>Log In</LoginLink>
        <RegisterLink>Sign Up</RegisterLink>
        <LogoutLink>Log Out</LogoutLink>
      </AppSidebar>
      {children}
    </AppShell>
  )
}
