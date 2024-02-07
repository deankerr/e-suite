import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export const CardLite = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function CardLite({ children, className, ...divProps }, ref) {
    return (
      <div
        ref={ref}
        {...divProps}
        className={cn('overflow-hidden rounded border bg-panel-translucent', className)}
      >
        {children}
      </div>
    )
  },
)
