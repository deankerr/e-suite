import Image from 'next/image'

import LogoSvg from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

export const Logo = ({ className, ...props }: Partial<React.ComponentProps<typeof Image>>) => {
  return (
    <Image
      {...props}
      src={LogoSvg}
      alt="logo"
      className={cn('size-6', className)}
      priority
      unoptimized
    />
  )
}
