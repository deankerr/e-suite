import NextImage from 'next/image'

import LogoSunset from '@/assets/logo-sunset.svg'
import { cn } from '@/lib/utils'

type LogoProps = Partial<React.ComponentProps<typeof NextImage>>

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <NextImage
      {...props}
      src={LogoSunset}
      alt="logo"
      className={cn('size-7 flex-none', className)}
      priority
      unoptimized
    />
  )
}
