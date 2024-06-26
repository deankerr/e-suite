import { Badge, Popover } from '@radix-ui/themes'
import { ClassNameValue } from 'tailwind-merge'

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { EChatModel, EImageModel } from '@/convex/shared/types'
import { cn } from '@/lib/utils'

export const ModelPicker = <T extends EChatModel | EImageModel>({
  models,
  onSelect,
  className,
}: {
  models: T[]
  onSelect?: (model: T) => unknown
  className?: ClassNameValue
}) => {
  return (
    <Command className={cn('border-none bg-transparent', className)}>
      <CommandInput className="border-grayA-3" placeholder="Search models" />
      <CommandList className="max-h-screen">
        <CommandEmpty>No results found.</CommandEmpty>
        {models.map((model) => (
          <CommandItem
            key={model._id}
            value={`${model.name} ${model.endpoint}`}
            className="flex-col items-start gap-1 border-b border-grayA-2 px-3 py-3 aria-selected:bg-grayA-2"
            onSelect={() => onSelect?.(model)}
          >
            <div className="flex w-full justify-between gap-1">
              <div className="">{model.name}</div>
              <Badge size="1" color="gray" className="shrink-0">
                {model.endpoint}
              </Badge>
            </div>
            <div className="flex w-full justify-between font-mono text-xs text-gray-11">
              {model.endpointModelId}
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}

export const ModelPickerCombobox = ({
  picker,
  children,
  ...props
}: { picker: React.ReactNode } & React.ComponentProps<typeof Popover.Root>) => {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content size="1" side="left" maxHeight="90vh">
        {picker}
      </Popover.Content>
    </Popover.Root>
  )
}
