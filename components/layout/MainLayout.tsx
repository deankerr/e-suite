import { GlobalCommandMenu } from '@/components/command-menu/GlobalCommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100svh] flex-col md:flex-row">
      <Nav className="sticky border-b md:flex-col md:border-r" />
      {children}
    </div>
  )
}

type NavProps = React.ComponentProps<'div'>
const Nav = ({ className, ...props }: NavProps) => {
  return (
    <nav {...props} className={cn('flex shrink-0 items-center gap-3 border-gray-4 p-3', className)}>
      <Logo />
      <GlobalCommandMenu />
      <div className="grow">{/* spacer */}</div>
      <UserButtons />
    </nav>
  )
}
