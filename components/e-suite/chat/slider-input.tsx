import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import * as React from 'react'

// shadcn Slider crudely masked as an Input element
export const InputSlider = React.forwardRef<
  HTMLDivElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value, onChange, min, max, step, defaultValue, dir, ...props }, ref) => {
  return (
    <Slider
      {...props}
      ref={ref}
      value={[Number(value)]}
      onValueChange={([v]) => {
        if (onChange) {
          const thisIsFine = onChange as (v: unknown) => void
          thisIsFine(v)
        }
      }}
      min={Number(min)}
      max={Number(max)}
      step={Number(step)}
      defaultValue={[Number(defaultValue)]}
    />
  )
})
InputSlider.displayName = 'InputSlider'

// original version, may not be needed
export function SliderWithInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { value, onChange, min, max, step, defaultValue, dir, ...rest } = props

  return (
    <div className="flex w-full space-x-1">
      <Slider
        {...rest}
        value={[Number(value)]}
        onValueChange={([v]) => {
          if (onChange) {
            const thisSomehowWorks = onChange as (v: unknown) => void
            thisSomehowWorks({ v })
          }
        }}
        onChange={(v) => console.log('onChange', v)}
        min={Number(min)}
        max={Number(max)}
        step={Number(step)}
        defaultValue={[Number(defaultValue)]}
      />
      <Input
        type="number"
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
    </div>
  )
}
