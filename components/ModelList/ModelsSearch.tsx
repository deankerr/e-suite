'use client'

import { Flex, TextField } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

type ModelsSearchProps = {
  props?: any
} & React.ComponentProps<typeof Flex>

export const ModelsSearch = ({ ...props }: ModelsSearchProps) => {
  return (
    <Flex {...props}>
      <TextField.Root size="2" className="w-full">
        <TextField.Slot>
          <SearchIcon size="16" strokeWidth="1" />
        </TextField.Slot>
        <TextField.Input placeholder="Search" className="w-full" />
      </TextField.Root>
    </Flex>
  )
}
