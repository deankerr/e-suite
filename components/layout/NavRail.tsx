'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
import { Logo } from '@/components/ui/Logo'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { cn } from '@/lib/utils'

type NavRailProps = React.ComponentProps<'div'>
export const NavRail = ({ className, ...props }: NavRailProps) => {
  const path = usePathname()
  return (
    <nav
      {...props}
      className={cn(
        'flex-start h-12 w-full shrink-0 gap-4 p-2.5 sm:flex-col-start sm:h-full sm:w-12 sm:py-3',
        className,
      )}
    >
      <Logo />
      <CommandMenu />

      <div className="grow">{/* spacer */}</div>

      <AdminOnlyUi>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/b/${path.slice(1)}`}>
            <Icons.Planet className="size-6" />
          </Link>
        </IconButton>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/c/none`}>
            <Icons.NumberZero className="size-6" />
          </Link>
        </IconButton>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/admin`}>
            <Icons.Nut className="size-6" />
          </Link>
        </IconButton>
      </AdminOnlyUi>
      <UserButtons />
    </nav>
  )
}
