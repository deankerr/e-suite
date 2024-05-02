import { forwardRef } from 'react'
import { Label as RadixLabel } from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

export const Label = ({
  className,
  ...props
}: Partial<React.ComponentProps<typeof RadixLabel>>) => {
  return <RadixLabel className={cn('text-xs', className)} {...props} />
}

export const LabelMono = forwardRef<HTMLLabelElement, React.ComponentProps<typeof RadixLabel>>(
  function Label({ className, ...props }, forwardedRef) {
    return (
      <RadixLabel {...props} className={cn('font-mono text-xs', className)} ref={forwardedRef} />
    )
  },
)
