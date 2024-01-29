import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type Props = {} & React.ComponentPropsWithoutRef<'div'>

export const Slate = forwardRef<HTMLDivElement, Props>(function Card(
  { children, className, ...divProps },
  ref,
) {
  return (
    <div
      ref={ref}
      {...divProps}
      className={cn('overflow-hidden rounded border bg-panel-translucent', className)}
    >
      {children}
    </div>
  )
})
