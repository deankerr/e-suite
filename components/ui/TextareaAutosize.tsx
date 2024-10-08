import ReactTextareaAutosize from 'react-textarea-autosize'

import { cn } from '@/app/lib/utils'

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
      minRows={1}
      rows={1}
      {...props}
      onChange={(e) => {
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      className={cn(
        'flex outline-none -outline-offset-1 focus-visible:outline-2 focus-visible:outline-accent-8 disabled:cursor-not-allowed disabled:opacity-50',
        'w-full resize-none rounded border border-grayA-7 bg-black/25 p-2 text-base font-normal text-gray-12 placeholder:text-grayA-10 sm:text-sm',
        className,
      )}
    />
  )
}
