import ReactTextareaAutosize from 'react-textarea-autosize'

import { cn } from '@/lib/utils'

export const TextareaAutosize = ({
  className,
  onChange,
  onValueChange,
  ...props
}: { onValueChange?: (value: string) => unknown } & React.ComponentProps<
  typeof ReactTextareaAutosize
>) => {
  return (
    <ReactTextareaAutosize
      {...props}
      onChange={(e) => {
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      className={cn(
        'flex focus-visible:outline-1 focus-visible:outline-accent-8 disabled:cursor-not-allowed disabled:opacity-50',
        'w-full resize-none rounded border border-grayA-7 bg-black/25 px-3 py-2 text-gray-12 placeholder:text-gray-9',
        className,
      )}
    />
  )
}
