import { forwardRef } from 'react'
import { useAtom } from 'jotai'
import TextareaAutosize from 'react-textarea-autosize'

import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'

import type { TextInputAtom } from '../threads/useThread'

type Props = {
  hideLabel?: boolean
  inputAtom: TextInputAtom
} & React.ComponentProps<typeof TextareaAutosize>

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { hideLabel, inputAtom, className, ...props },
  forwardedRef,
) {
  const [value, setValue] = useAtom(inputAtom.atom)
  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <Label htmlFor={inputAtom.name} className={cn(hideLabel && 'sr-only')}>
        {inputAtom.label}
      </Label>
      <TextareaAutosize
        rows={1}
        {...props}
        className="w-full resize-none rounded border border-gray-7A bg-surface p-1 text-base focus:outline-accent-8"
        name={inputAtom.name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={forwardedRef}
      />
    </div>
  )
})
