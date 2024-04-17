import { forwardRef } from 'react'
import * as RxLabel from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

export const Label = forwardRef<HTMLLabelElement, React.ComponentProps<'label'>>(
  function Label({ className, ...props }, forwardedRef) {
    return <RxLabel.Root {...props} className={cn('text-xs', className)} ref={forwardedRef} />
  },
)
