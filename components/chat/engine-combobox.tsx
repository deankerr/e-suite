import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function EngineCombobox({
  engineList,
  current,
  setCurrent,
}: {
  engineList: Pick<Engine, 'id' | 'displayName'>[]
  current: Engine['id']
  setCurrent: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <div className="w-4" />
          {current ? engineList.find((e) => e.id === current)?.displayName : 'Select engine...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search engine..." className="h-9" />
          <CommandEmpty>No engine found.</CommandEmpty>
          <CommandGroup>
            {engineList.map((e) => (
              <CommandItem
                key={e.id}
                value={e.id}
                onSelect={(value) => {
                  setCurrent(value === current ? '' : value)
                  setOpen(false)
                }}
              >
                {e.displayName}
                <CheckIcon
                  className={cn('ml-auto h-4 w-4', current === e.id ? 'opacity-100' : 'opacity-0')}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
