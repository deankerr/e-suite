import { Label } from '@radix-ui/react-label'
import { Slider } from '@radix-ui/themes'

import { TextField } from '@/components/ui/TextField'

export const SliderWithInput = ({
  label,
  defaultValue,
  value,
  onValueChange,
  min,
  max,
  step,
  ...props
}: {
  label: string
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => unknown
} & Omit<React.ComponentProps<typeof Slider>, 'defaultValue' | 'value' | 'onValueChange'>) => {
  return (
    <Label className="space-y-2 text-sm">
      <div className="flex-between">
        <div>{label}</div>
        <TextField
          type="number"
          className="h-full w-full max-w-20 px-1 py-0.5 text-right"
          size="2"
          defaultValue={defaultValue}
          value={value}
          onValueChange={(value) => onValueChange?.(Number(value))}
          min={min}
          max={max}
          step={step}
        />
      </div>

      <Slider
        {...props}
        size="1"
        defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
        value={value !== undefined ? [value] : undefined}
        onValueChange={(values) =>
          values[0] !== undefined && onValueChange ? onValueChange(values[0]) : undefined
        }
        min={min}
        max={max}
        step={step}
      />
    </Label>
  )
}
