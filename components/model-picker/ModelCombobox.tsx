import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Command as Cmdk } from 'cmdk'
import { ChevronsUpDownIcon, SearchIcon } from 'lucide-react'

import { chatModels } from '@/convex/shared/models'
import { cn } from '@/lib/utils'

type ModelComboboxProps = {
  value: string
  onValueChange: (value: string) => unknown
} & React.ComponentProps<typeof Popover.Root>

export const ModelCombobox = ({ value, onValueChange, ...props }: ModelComboboxProps) => {
  const [open, setOpen] = useState(false)

  const currentModel = chatModels.find(
    (model) => `${model.endpoint}::${model.endpointModelId}` === value,
  )

  return (
    <Popover.Root open={open} onOpenChange={setOpen} {...props}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'gap-2 rounded-md border bg-gray-1 px-3 py-2 flex-center hover:bg-gray-2 active:bg-gray-3',
          )}
        >
          <div className="grow text-left">{currentModel?.name}</div>

          <div className="shrink-0 text-right">
            <div className="text-sm">chat</div>
            <div className="font-mono text-xs text-gray-10">{currentModel?.endpoint}</div>
          </div>

          <div className="shrink-0 text-gray-11 flex-center">
            <ChevronsUpDownIcon />
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Content align="center" sideOffset={5}>
        <Cmdk
          label="Model Combobox"
          className={cn('flex h-full w-full flex-col overflow-hidden rounded-md border bg-gray-1')}
        >
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Cmdk.Input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search..."
            />
          </div>

          <Cmdk.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Cmdk.Empty className="py-6 text-center text-sm">No results found.</Cmdk.Empty>

            {chatModels.map((model) => (
              <Cmdk.Item
                key={model.endpointModelId}
                value={`${model.endpoint}::${model.endpointModelId}`}
                className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-11 outline-none aria-selected:bg-gray-3 aria-selected:text-gray-12 data-[disabled="false"]:pointer-events-auto data-[disabled="true"]:opacity-50'
                onSelect={(value) => {
                  onValueChange(value)
                  setOpen(false)
                }}
              >
                {model.name}
                <div className="grow text-right font-mono text-xs text-gray-10">
                  {model.endpoint}
                </div>
              </Cmdk.Item>
            ))}
          </Cmdk.List>
        </Cmdk>
      </Popover.Content>
    </Popover.Root>
  )
}
