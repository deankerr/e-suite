import sunLogoSvg from '@/assets/logo-sunset.svg'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'
import { forwardRef } from 'react'

export const Logo = forwardRef<HTMLImageElement, Partial<React.ComponentProps<typeof NextImage>>>(
  function Logo({ className, ...props }, forwardedRef) {
    return (
      <NextImage
        {...props}
        ref={forwardedRef}
        src={sunLogoSvg}
        alt="e/suite sun logo"
        className={cn('', className)}
      />
    )
  },
)
