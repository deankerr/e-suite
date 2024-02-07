import { cn } from '@/lib/utils'
import { IconButton as RxIconButton } from '@radix-ui/themes'
import { forwardRef } from 'react'

export const IconButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof RxIconButton>>(
  function IconButton({ children, className, ...props }, forwardedRef) {
    return (
      <RxIconButton
        variant="surface"
        {...props}
        className={cn(
          'cursor-pointer disabled:cursor-not-allowed [&_svg]:size-5 [&_svg]:stroke-1',
          className,
        )}
        ref={forwardedRef}
      >
        {children}
      </RxIconButton>
    )
  },
)
