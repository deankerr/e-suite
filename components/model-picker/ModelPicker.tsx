import { Badge } from '@radix-ui/themes'
import { ClassNameValue } from 'tailwind-merge'

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/Command'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EChatModel } from '@/convex/shared/types'
import { useChatModels } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const ModelPicker = ({
  className,
  onSelect,
}: {
  onSelect?: (model: EChatModel) => unknown
  className?: ClassNameValue
}) => {
  const models = useChatModels()

  return (
    <Command className={cn('border-none bg-transparent', className)}>
      {models.isError ? (
        models.error.message
      ) : models.isPending ? (
        <CommandLoading className="flex w-full justify-center py-2">
          <LoadingSpinner />
        </CommandLoading>
      ) : (
        <>
          <CommandInput className="border-grayA-3" placeholder="Search models" />
          <CommandList className="max-h-screen">
            <CommandEmpty>No results found.</CommandEmpty>
            {models.data.map((model) => (
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
        </>
      )}
    </Command>
  )
}
