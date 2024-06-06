import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

type NavRailProps = React.ComponentProps<'div'>
export const NavRail = ({ className, ...props }: NavRailProps) => {
  return (
    <nav
      {...props}
      className={cn(
        'flex w-12 shrink-0 flex-col items-center gap-3 border-gray-4 bg-grayA-1 py-3 backdrop-blur',
        className,
      )}
    >
      <Logo />
      <CommandMenu />
      <div className="grow">{/* spacer */}</div>
      <UserButtons />
    </nav>
  )
}
