import { forwardRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { cn } from '@/lib/utils'

type TextareaAutoProps = { onValueChange?: (value: string) => unknown } & React.ComponentProps<
  typeof TextareaAutosize
>

export const TextareaAuto = forwardRef<HTMLTextAreaElement, TextareaAutoProps>(
  function TextareaAuto({ onValueChange, onChange, className, ...props }, forwardedRef) {
    return (
      <TextareaAutosize
        {...props}
        className={cn(
          'w-full resize-none rounded border border-grayA-7 bg-black/25 p-2 text-gray-12 placeholder:text-gray-9 focus-within:outline-accent-8',
          className,
        )}
        onChange={(e) => {
          onValueChange?.(e.target.value)
          onChange?.(e)
        }}
        ref={forwardedRef}
      />
    )
  },
)
