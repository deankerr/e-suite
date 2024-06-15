import { IconButton } from '@radix-ui/themes'
import { CircleIcon, MessagesSquareIcon, ScanEyeIcon } from 'lucide-react'
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
        'flex w-12 shrink-0 flex-col items-center gap-3 border-gray-4 bg-grayA-1 py-3 backdrop-blur-3xl ',
        className,
      )}
    >
      <Image src={HexLogo} alt="logo" className="size-8 flex-none" priority />
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

      <NonSecureAdminRoleOnly>
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
