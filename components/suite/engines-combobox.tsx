'use client'

import { Button, ButtonProps } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { useAgentMutation, useAgentQuery, useEnginesQuery, useTabs } from './queries'

export function EnginesCombobox({ current = '' }: { current?: string }) {
  const [open, setOpen] = React.useState(false)
  // const [localValue, setLocalValue] = React.useState(current)

  // const value = localValue
  // const setValue = setLocalValue

  const { focusedTab } = useTabs()
  const { data: agent } = useAgentQuery(focusedTab?.agentId)
  const mutator = useAgentMutation(agent?.id)
  const { data: engines = [] } = useEnginesQuery()

  const value = agent?.engineId ?? ''
  const setValue = (value: string) => {
    if (agent) {
      mutator.mutate({ agentId: agent?.id, merge: { engineId: value } })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[36rem] justify-between')}
        >
          {value ? engines.find((item) => item.id === value)?.displayName : 'Select a model...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[36rem] p-0')}>
        <Command label="Model Menu">
          <CommandInput placeholder={'Search models...'} className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList>
            {engines.map((item) => {
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
