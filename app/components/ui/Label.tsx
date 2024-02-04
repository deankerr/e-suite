import { cn } from '@/lib/utils'
import * as RxLabel from '@radix-ui/react-label'
import { forwardRef } from 'react'

type Props = {}

export const Label = forwardRef<HTMLLabelElement, Props & React.ComponentProps<'label'>>(
  function Label({ className, ...props }, forwardedRef) {
    return <RxLabel.Root {...props} className={cn('text-xs', className)} ref={forwardedRef} />
  },
)
