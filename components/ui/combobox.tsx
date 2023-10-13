'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import * as React from 'react'

type Props = {
  items: string[]
  defaultItem?: string
} & ButtonProps

const normalize = (v: string) => v.trim().toLowerCase()

export function Combobox({ items, className, defaultItem = '', ...props }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(() => normalize(defaultItem))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          {...props}
        >
          {value ? items.find((item) => normalize(item) === value) : 'Select item...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => {
              return (
                <CommandItem
                  key={item}
                  onSelect={(currentValue) => {
                    setValue(currentValue === normalize(value) ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {item}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === normalize(item) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
