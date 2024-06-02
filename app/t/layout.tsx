import { GlobalCommandMenu } from '@/components/command-menu/GlobalCommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
// import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
import { Logo } from '@/components/ui/Logo'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      {/* <header className="sticky flex h-11 items-center justify-between gap-2 border-b border-gray-4 px-2">
        <AppLogoTitle />
        <UserButtons />
      </header> */}

      <div className="flex h-[calc(100svh-2.75rem)] w-full md:h-[100svh]">
        <div className="h-full w-11 shrink-0 border-r border-gray-4 flex-col-start">
          <div className="h-11 w-full border-b border-gray-4 flex-col-center md:border-transparent">
            <Logo />
          </div>

          <div className="grow py-3 flex-col-between">
            <GlobalCommandMenu />
            <UserButtons />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
