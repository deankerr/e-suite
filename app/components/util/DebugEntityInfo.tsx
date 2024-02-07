import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type Props = {
  values?: React.ReactNode[]
}

export const DebugEntityInfo = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function DebugEntityInfo({ values, children, className, ...props }, forwardedRef) {
    if (process.env.NODE_ENV !== 'development') return null
    return (
      <div
        {...props}
        className={cn(
          'absolute right-0 top-0 flex flex-col items-end font-code text-xs text-gold-8',
          className,
        )}
        ref={forwardedRef}
      >
        {values?.map((value, i) => (
          <div key={i} className="w-fit bg-panel-translucent">
            {value ?? '?'}
          </div>
        ))}
        {children}
      </div>
    )
  },
)
