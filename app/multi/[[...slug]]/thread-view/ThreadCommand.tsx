'use client'

import { forwardRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Command as Cmdk } from 'cmdk'
import { BoxIcon, ChevronLeftIcon, PencilIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useModelList, useThreadStack } from '@/app/multi/[[...slug]]/hooks'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ThreadCommandProps = { thread: EThreadWithContent; trigger: React.ReactNode }

export const ThreadCommand = ({ thread, trigger }: ThreadCommandProps) => {
  const router = useRouter()
  const multi = useThreadStack()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')

  const inference = thread.inferenceConfig[thread.inferenceConfig.primary]
  const { current, chatModels, imageModels } = useModelList({
    endpoint: inference.endpoint,
    endpointModelId: inference.parameters.model,
  })

  return (
    <Popover.Root
      open={open}
      onOpenChange={(open) => {
        if (open) setPage('')
        setOpen(open)
      }}
    >
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Content align="center" sideOffset={5} className="w-80">
        <Cmdk
          label="Thread Combobox"
          className={cn('flex h-full w-full flex-col overflow-hidden rounded-md border bg-gray-1')}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
              e.preventDefault()
              setPage('')
            }
          }}
        >
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Cmdk.Input
              value={search}
              onValueChange={setSearch}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search..."
            />
          </div>

          <Cmdk.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Cmdk.Empty className="py-6 text-center text-sm">No results found.</Cmdk.Empty>

            {!page && (
              <>
                <Item>
                  <PencilIcon className="mr-2 size-4" />
                  Edit Title
                </Item>
                <Item>
                  <Trash2Icon className="mr-2 size-4" />
                  Delete Thread
                </Item>
                <Item onSelect={() => setPage('chatModels')}>
                  <BoxIcon className="mr-2 size-4" />
                  <div className="line-clamp-1 grow">Model: {current?.name}</div>
                  <div className="text-xs text-gray-10">change</div>
                </Item>
              </>
            )}

            {page === 'chatModels' && (
              <>
                <Item onSelect={() => setPage('')} className="text-gray-10">
                  <ChevronLeftIcon className="mr-2 size-4" />
                  return
                </Item>

                {chatModels.map((model) => (
                  <Item key={model.resourceId} value={model.resourceId}>
                    <div className="line-clamp-1 grow">{model.name}</div>
                    <div className="shrink-0 text-xs text-gray-11">{model.endpoint}</div>
                  </Item>
                ))}
              </>
            )}
          </Cmdk.List>
        </Cmdk>
      </Popover.Content>
    </Popover.Root>
  )
}

const Item = forwardRef<HTMLDivElement, React.ComponentProps<typeof Cmdk.Item>>(
  function ThreadCommandItem({ className, ...props }, forwardedRef) {
    return (
      <Cmdk.Item
        {...props}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-11 outline-none aria-selected:bg-gold-2 data-[disabled="false"]:pointer-events-auto data-[disabled="true"]:opacity-50',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

const Group = forwardRef<HTMLDivElement, React.ComponentProps<typeof Cmdk.Group>>(
  function ThreadCommandGroup({ className, ...props }, forwardedRef) {
    return (
      <Cmdk.Group
        {...props}
        className={cn(
          'overflow-hidden p-1 text-gray-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-11',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)
