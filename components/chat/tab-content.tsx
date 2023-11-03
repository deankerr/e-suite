import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type Props = { title?: string }

export const TabContent = forwardRef<HTMLDivElement, Props & React.ComponentPropsWithRef<'div'>>(
  function TabContent({ title, className, children, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cn('p-6', className)}>
        {title && <h3 className="mb-4 font-semibold leading-none tracking-tight">{title}</h3>}
        {children}
      </div>
    )
  },
)
