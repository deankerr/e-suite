import { ExtractPropsOfType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { useRef, useState } from 'react'
import { Control } from 'react-hook-form'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { FormSchemaOpenAI } from './inference-parameter-form'

type TagInputControlProps = {
  control: Control<FormSchemaOpenAI>
  name: keyof ExtractPropsOfType<FormSchemaOpenAI, string[] | undefined>
  description?: string
  defaultEnabled?: boolean
}
export function ToggleTagInput({ control, name, defaultEnabled = false }: TagInputControlProps) {
  const [disabled, setDisabled] = useState(!defaultEnabled)
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field }) => {
        const fieldValue = field.value ?? []
        field.ref
        const addTag = () => {
          if (!inputRef.current) return
          const { value } = inputRef.current

          if (value === '' || fieldValue.includes(value)) return
          field.onChange([...fieldValue, value])
          inputRef.current.value = ''
        }

        return (
          <FormItem className="flex w-full flex-col">
            {/* switch + label */}
            <div className="flex w-full items-center gap-3">
              <Switch checked={!disabled} onCheckedChange={(checked) => setDisabled(!checked)} />
              <FormLabel className="font-mono">{field.name}</FormLabel>
            </div>

            {/* add tags */}
            <FormControl>
              <div
                className={cn('flex w-full gap-2', disabled && 'opacity-50')}
                onMouseDown={() => disabled && setDisabled(false)}
              >
                <Input
                  ref={inputRef}
                  className="font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) addTag()
                  }}
                />
                <Button variant="outline" type="button" onClick={addTag}>
                  <PlusCircledIcon />
                </Button>
              </div>
            </FormControl>

            {/* show + remove tags */}
            <div className={cn('w-full space-y-1', disabled && 'opacity-50')}>
              {field.value?.map((v, i) => (
                <Badge
                  className="ml-1 justify-between gap-1 pr-1 font-sans text-sm font-normal"
                  key={v}
                  onMouseDown={() => disabled && setDisabled(false)}
                >
                  {v}
                  <Button
                    className="h-5 w-7"
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => {
                      field.onChange([...fieldValue.filter((_, _i) => i !== _i)])
                    }}
                  >
                    <CrossCircledIcon />
                  </Button>
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
