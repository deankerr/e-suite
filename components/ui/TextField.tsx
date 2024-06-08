import { forwardRef } from 'react'
import { TextField as RxTextField } from '@radix-ui/themes'

type TextFieldProps = { onValueChange?: (value: string) => unknown } & React.ComponentProps<
  typeof RxTextField.Root
>

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { onValueChange, onChange, ...props },
  forwardedRef,
) {
  return (
    <RxTextField.Root
      {...props}
      onChange={(e) => {
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      ref={forwardedRef}
    />
  )
})

export const TextFieldSlot = RxTextField.Slot
