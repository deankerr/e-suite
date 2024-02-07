import { cn } from '@/lib/utils'
import { Button as RxButton } from '@radix-ui/themes'
import { forwardRef } from 'react'

export const Button = forwardRef<HTMLButtonElement, React.ComponentProps<typeof RxButton>>(
  function Button({ children, className, ...props }, forwardedRef) {
    return (
      <RxButton
        variant="surface"
        {...props}
        className={cn('cursor-pointer', className)}
        ref={forwardedRef}
      >
        {children}
      </RxButton>
    )
  },
)
