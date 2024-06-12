import Image from 'next/image'
import NextLink from 'next/link'

import HexLogo from '@/assets/svg/hex.svg'
import { cn } from '@/lib/utils'

type AppLogoTitleProps = Partial<React.ComponentProps<typeof NextLink>>

export const AppLogoTitle = ({ className, ...props }: AppLogoTitleProps) => {
  return (
    <NextLink href="/" {...props} className={cn('shrink-0', className)}>
      <div className="gap-1 flex-start">
        <Image src={HexLogo} alt="logo" className="size-8 flex-none" priority />

        <h1 className="flex-none text-xl font-semibold tracking-tight">e/suite</h1>
      </div>
    </NextLink>
  )
}
