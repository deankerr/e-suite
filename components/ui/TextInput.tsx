import { Label } from '@/app/components/ui/Label'
import { cn } from '@/lib/utils'
import { TextFieldInput } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { forwardRef } from 'react'
import { TextInputAtom } from '../threads/useThread'

type Props = {
  inputAtom: TextInputAtom
} & React.ComponentProps<typeof TextFieldInput>

export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { inputAtom, className, ...props },
  forwardedRef,
) {
  const [value, setValue] = useAtom(inputAtom.atom)
  return (
    <div className="flex flex-col gap-1 p-3">
      <Label htmlFor={inputAtom.name}>{inputAtom.label}</Label>
      <TextFieldInput
        {...props}
        className={cn('w-full resize-none rounded border border-gray-7A bg-surface p-1', className)}
        name={inputAtom.name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={forwardedRef}
      />
    </div>
  )
})
