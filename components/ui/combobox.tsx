'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import * as React from 'react'

type ComboboxItem = {
  value: string
  label: string
}

type Props = {
  items: ComboboxItem[]
  buttonProps?: ButtonProps
  popoverProps?: PopoverContentProps
  selectText?: string
  searchText?: string
  value?: string
  setValue?: (value: string) => void
}

export function Combobox({
  items,
  buttonProps,
  popoverProps,
  selectText,
  searchText,
  ...props
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(props.value ?? '')

  const value = props.value ?? localValue
  const setValue = props.setValue ?? setLocalValue
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          {...buttonProps}
          className={cn('w-[200px] justify-between', buttonProps?.className)}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : selectText ?? 'Select item...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent {...popoverProps} className={cn('w-[200px] p-0', popoverProps?.className)}>
        <Command>
          <CommandInput placeholder={searchText ?? 'Search item...'} className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => {
              return (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
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
