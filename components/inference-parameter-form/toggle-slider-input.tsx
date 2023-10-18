import { ExtractPropsOfType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { FormSchemaOpenAI } from './inference-parameter-form'

type Props = {
  control: Control<FormSchemaOpenAI>
  name: keyof ExtractPropsOfType<FormSchemaOpenAI, number | undefined>
  description?: string
  range: Record<'min' | 'max' | 'step', number>
  defaultEnabled?: boolean
}

export function ToggleSliderInput({ control, name, range, defaultEnabled }: Props) {
  const [disabled, setDisabled] = useState(!defaultEnabled)

  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field }) => {
        const { value, disabled, onChange, ...fieldProps } = field

        return (
          <FormItem className="flex w-full flex-col space-y-0">
            <div className="flex w-full items-center gap-3">
              <Switch checked={!disabled} onCheckedChange={(checked) => setDisabled(!checked)} />
              <FormLabel className="font-mono">{field.name}</FormLabel>
            </div>

            <FormControl>
              <div className={cn('flex w-full space-x-1', disabled && 'opacity-50')}>
                <Slider
                  {...fieldProps}
                  {...range}
                  value={[value ?? 0]}
                  onValueChange={([v]) => {
                    if (disabled) setDisabled(false)
                    onChange(v)
                  }}
                  onMouseDown={() => disabled && setDisabled(false)}
                />
                <Input
                  {...fieldProps}
                  {...range}
                  onChange={onChange}
                  className="w-20 px-1 text-right font-mono"
                  type="number"
                  value={value ?? 0}
                  onMouseDown={() => disabled && setDisabled(false)}
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
