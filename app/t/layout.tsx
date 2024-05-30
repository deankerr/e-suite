import { GlobalCommandMenu } from '@/components/command-menu/GlobalCommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoTitle } from '@/components/ui/AppLogoTitle'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="sticky flex h-11 items-center justify-between gap-2 border-b px-2">
        <AppLogoTitle />
        <GlobalCommandMenu />
        <UserButtons />
      </header>
      {children}
    </div>
  )
}
