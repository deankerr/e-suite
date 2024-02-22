import { Label } from '@/app/components/ui/Label'
import { cn } from '@/lib/utils'
import { TextFieldInput } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { forwardRef } from 'react'
import { TextInputAtom } from '../threads/useThread'

type Props = {
  inputAtom: TextInputAtom
  hideLabel?: boolean
} & React.ComponentProps<typeof TextFieldInput>

export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { inputAtom, hideLabel, className, ...props },
  forwardedRef,
) {
  const [value, setValue] = useAtom(inputAtom.atom)
  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <Label htmlFor={inputAtom.name} className={cn(hideLabel && 'sr-only')}>
        {inputAtom.label}
      </Label>
      <TextFieldInput
        {...props}
        size="3"
        name={inputAtom.name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={forwardedRef}
      />
    </div>
  )
})
