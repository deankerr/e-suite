import { NumberZero, Nut } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import Link from 'next/link'

import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
import { Logo } from '@/components/ui/Logo'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { cn } from '@/lib/utils'

type NavRailProps = React.ComponentProps<'div'>
export const NavRail = ({ className, ...props }: NavRailProps) => {
  return (
    <nav
      {...props}
      className={cn(
        '-mb-2 w-full shrink-0 gap-3 p-2 flex-start sm:-mr-2 sm:mb-0 sm:w-auto sm:flex-col-start',
        className,
      )}
    >
      <Logo />
      <CommandMenu />

      <div className="grow">{/* spacer */}</div>

      <NonSecureAdminRoleOnly>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/c/none`}>
            <NumberZero className="size-6" />
          </Link>
        </IconButton>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/admin`}>
            <Nut className="size-6" />
          </Link>
        </IconButton>
      </NonSecureAdminRoleOnly>
      <UserButtons />
    </nav>
  )
}
