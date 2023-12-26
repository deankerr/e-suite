'use client'

import { Box, Button, Text, TextField } from '@radix-ui/themes'
import { Command } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'

type Props = {
  items: { id: string; name: string }[]
} & React.ComponentPropsWithoutRef<typeof Command>

export const ModelFilterableList = forwardRef<HTMLDivElement, Props>(
  ({ items = [], ...props }, ref) => {
    const [searchValue, setSearchValue] = useState('')

    return (
      <Command label="Models Search List" className="overflow-y-hidden" ref={ref} {...props}>
        <TextField.Root>
          <TextField.Slot>
            <SearchIcon size="16" strokeWidth="1" />
          </TextField.Slot>
          <TextField.Input
            placeholder="Search models…"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </TextField.Root>

        <Command.Input aria-hidden={true} className="hidden" value={searchValue} />
        <Command.List className="max-h-[70svh] overflow-y-auto px-1 py-2">
          <Command.Empty>No results found.</Command.Empty>

          {items.map((item) => (
            <Command.Item key={item.id}>
              {/* <Text size="2">{item.name}</Text> */}
              <Button variant="ghost" color="gray">
                {item.name}
              </Button>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    )
  },
)
ModelFilterableList.displayName = 'ModelFilterableList'
