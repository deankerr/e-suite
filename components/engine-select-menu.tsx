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
import { Resource } from '@/data/types'
import { cn, raise } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function EngineSelectMenu({
  engines,
  value,
  onValueChange,
  className,
  editable = true,
}: {
  engines: Resource[]
  value?: Resource
  onValueChange: (value: Resource) => void
  className?: React.ComponentProps<typeof Button>['className']
  editable?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={editable ? setOpen : undefined}>
      <PopoverTrigger asChild>
        <Button
          variant={editable ? 'outline' : 'static'}
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex justify-between px-2 font-normal',
            editable ? '' : 'shadow-none',
            className,
          )}
        >
          {value ? value.id : 'Select a model...'}
          <CaretSortIcon
            className={cn('ml-2 h-4 w-4 shrink-0', editable ? 'opacity-50' : 'opacity-0')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[24rem] p-0')}>
        <Command label="Model Menu">
          <CommandInput placeholder={'Search models...'} className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList>
            {engines.map((engine) => {
              if (engine)
                return (
                  <CommandItem
                    key={engine.id}
                    value={engine.id}
                    onSelect={(newValue) => {
                      if (newValue !== value?.id) {
                        const newEngine =
                          engines.find((e) => e.id === newValue) ??
                          raise('Invalid model select state')
                        onValueChange(newEngine)
                      }
                      setOpen(false)
                    }}
                  >
                    {engine.id}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value?.id === engine.id ? 'opacity-100' : 'opacity-0',
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
