import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

type Props = {}

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  Props & React.ComponentProps<typeof TextareaAutosize>
>(function TextArea({ className, ...props }, forwardedRef) {
  //
  return (
    <TextareaAutosize
      {...props}
      className={cn('w-full resize-none rounded border border-gray-7A bg-surface p-1', className)}
      ref={forwardedRef}
    />
  )
})
