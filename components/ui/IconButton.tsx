import { forwardRef } from 'react'
import { IconButton as RxIconButton } from '@radix-ui/themes'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  lucideIcon?: LucideIcon
}

export const IconButton = forwardRef<
  HTMLButtonElement,
  Props & React.ComponentProps<typeof RxIconButton>
>(function IconButton({ lucideIcon, children, className, ...props }, forwardedRef) {
  const LIcon = lucideIcon
  return (
    <RxIconButton
      variant="surface"
      {...props}
      className={cn('cursor-pointer disabled:cursor-not-allowed', className)}
      ref={forwardedRef}
    >
      {LIcon ? <LIcon className="stroke-1" /> : children}
    </RxIconButton>
  )
})
