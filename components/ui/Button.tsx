import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton as RadixIconButton } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

import type { SetRequired } from 'type-fest'

export const IconButton = ({
  className,
  children,
  ...props
}: SetRequired<React.ComponentProps<typeof RadixIconButton>, 'aria-label'>) => {
  return (
    <RadixIconButton {...props} className={cn(props.variant === 'ghost' && 'm-0', className)}>
      {children}
    </RadixIconButton>
  )
}
