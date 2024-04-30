import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

type TextareaProps = React.ComponentProps<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  forwardedRef,
) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full resize-none rounded-lg border bg-black px-2 py-2 text-gray-11 outline-none',
        className,
      )}
      ref={forwardedRef}
    />
  )
})
