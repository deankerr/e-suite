import { IconButton } from '@radix-ui/themes'
import { CircleIcon, ScanEyeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import HexLogo from '@/assets/svg/hex.svg'
import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { UserButtons } from '@/components/layout/UserButtons'
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
      <Image src={HexLogo} alt="logo" className="size-8 flex-none" priority />
      <CommandMenu />
      {/* <IconButton variant="ghost" className="shrink-0" asChild>
        <Link href={`/c`}>
          <MessagesSquareIcon />
        </Link>
      </IconButton> */}

      <div className="grow">{/* spacer */}</div>

      <NonSecureAdminRoleOnly>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/c/none`}>
            <CircleIcon />
          </Link>
        </IconButton>
        <IconButton variant="ghost" className="shrink-0" asChild>
          <Link href={`/admin`}>
            <ScanEyeIcon />
          </Link>
        </IconButton>
      </NonSecureAdminRoleOnly>
      <UserButtons />
    </nav>
  )
}
