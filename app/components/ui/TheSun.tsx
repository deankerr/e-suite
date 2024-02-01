import sunLogoSvg from '@/assets/logo-sunset.svg'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'
import { forwardRef } from 'react'

type Props = {}

export const TheSun = forwardRef<HTMLButtonElement, Props & React.ComponentProps<'button'>>(
  function TheSun({ className, ...props }, forwardedRef) {
    //
    return (
      <button
        {...props}
        className={cn('after:sun-glow2 size-16 cursor-pointer p-2', className)}
        ref={forwardedRef}
      >
        <NextImage src={sunLogoSvg} alt="e/suite sun logo" className="rounded-full" />
      </button>
    )
  },
)
