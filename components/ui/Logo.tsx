import Image from 'next/image'

import Noun26 from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

type LogoProps = Partial<React.ComponentProps<typeof Image>>

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <Image
      {...props}
      src={Noun26}
      alt="logo"
      className={cn('size-7 flex-none', className)}
      priority
      unoptimized
    />
  )
}
