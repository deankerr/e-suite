import { IconButton } from '@radix-ui/themes'
import { CircleIcon, MessagesSquareIcon } from 'lucide-react'
import Link from 'next/link'

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
        'flex w-12 shrink-0 flex-col items-center gap-3 border-gray-4 bg-grayA-1 py-3 backdrop-blur-3xl',
        className,
      )}
    >
      <Logo />
      <CommandMenu />
      <IconButton variant="ghost" className="shrink-0" asChild>
        <Link href={`/c`}>
          <MessagesSquareIcon />
        </Link>
      </IconButton>
      <IconButton variant="ghost" className="shrink-0" asChild>
        <Link href={`/c/none`}>
          <CircleIcon />
        </Link>
      </IconButton>
      <div className="grow">{/* spacer */}</div>
      <UserButtons />
    </nav>
  )
}
