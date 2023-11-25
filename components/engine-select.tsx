import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Engine } from '@/lib/db'
import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useEngines } from './queries-reloaded'

export function EngineSelect(props: {
  value?: string
  setValue?: (value: string) => void
  className?: React.ComponentProps<typeof Button>['className']
}) {
  const [open, setOpen] = useState(false)
  const [localValue, setLocalValue] = useState(props.value ?? '')

  const value = props.value ?? localValue
  const setValue = props.setValue ?? setLocalValue

  const engines = useEngines()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full max-w-sm justify-between font-normal', props.className)}
        >
          {value
            ? engines.data?.find((item) => item.id === value)?.displayName
            : 'Select a model...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[24rem] p-0')}>
        <Command label="Model Menu">
          <CommandInput placeholder={'Search models...'} className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList>
            {engines.data?.map((item) => {
              return (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(selectedValue) => {
                    if (selectedValue !== value) setValue(selectedValue)
                    setOpen(false)
                  }}
                >
                  {item.displayName}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === item.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
