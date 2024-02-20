import { Label } from '@/app/components/ui/Label'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { forwardRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { TextInputAtom } from '../threads/useThread'

type Props = {
  inputAtom: TextInputAtom
} & React.ComponentProps<typeof TextareaAutosize>

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { inputAtom, className, ...props },
  forwardedRef,
) {
  const [value, setValue] = useAtom(inputAtom.atom)
  return (
    <div className="flex flex-col gap-1 p-3">
      <Label htmlFor={inputAtom.name}>{inputAtom.label}</Label>
      <TextareaAutosize
        rows={1}
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