import { forwardRef } from 'react'
import { AccessibleIcon, IconButton as RadixIconButton } from '@radix-ui/themes'

type Props = {
  label: string
}

export const IconButton = forwardRef<
  HTMLButtonElement,
  Props & React.ComponentProps<typeof RadixIconButton>
>(function IconButton({ label, children, ...props }, forwardedRef) {
  return (
    <RadixIconButton variant="surface" {...props} ref={forwardedRef}>
      {label ? <AccessibleIcon label={label}>{children}</AccessibleIcon> : children}
    </RadixIconButton>
  )
})
