import { forwardRef } from 'react'
import { Button as RxButton } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

export const Button = forwardRef<HTMLButtonElement, React.ComponentProps<typeof RxButton>>(
  function Button({ children, className, ...props }, forwardedRef) {
    return (
      <RxButton
        variant="surface"
        {...props}
        className={cn('cursor-pointer disabled:cursor-not-allowed', className)}
        ref={forwardedRef}
      >
        {children}
      </RxButton>
    )
  },
)
