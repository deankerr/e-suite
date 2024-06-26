import { Label } from '@radix-ui/react-label'
import { TextField as RxTextField } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

export const TextField = ({
  label,
  onValueChange,
  className,
  onChange,
  ...props
}: { label: string; onValueChange?: (value: string) => unknown } & React.ComponentProps<
  typeof RxTextField.Root
>) => {
  return (
    <Label className={cn('grid text-sm', className)}>
      {label}
      <RxTextField.Root
        {...props}
        onChange={(e) => {
          onValueChange?.(e.target.value)
          onChange?.(e)
        }}
      />
    </Label>
  )
}
