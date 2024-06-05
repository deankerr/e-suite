import { GlobalCommandMenu } from '@/components/command-menu/GlobalCommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

type NavRailProps = React.ComponentProps<'div'>
export const NavRail = ({ className, ...props }: NavRailProps) => {
  return (
    <nav
      {...props}
      className={cn('flex flex-col items-center gap-3 border-gray-4 bg-gray-1 p-3', className)}
    >
      <Logo />
      <GlobalCommandMenu />
      <div className="grow">{/* spacer */}</div>
      <UserButtons />
    </nav>
  )
}
