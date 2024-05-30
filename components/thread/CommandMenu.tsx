import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { BoxIcon, ChevronsUpDownIcon, PencilIcon, Trash2Icon } from 'lucide-react'

import { useModelsData } from '@/components/thread/hooks'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { DeleteThreadDialog, UpdateThreadTitleDialog } from '@/components/ui/dialogs'

import type { EThreadWithContent } from '@/convex/shared/structures'

type CommandMenuProps = { thread: EThreadWithContent } & React.ComponentProps<typeof Popover.Root>

export const CommandMenu = ({ thread, ...props }: CommandMenuProps) => {
  const { getModel } = useModelsData()
  const inference = thread.active
  const currentModel = getModel([inference.endpoint, inference.parameters.model])

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')
  const [dialog, setDialog] = useState('')
  return (
    <Popover.Root
      {...props}
      open={open}
      onOpenChange={(open) => {
        if (open) setPage('')
        setOpen(open)
      }}
    >
      <Popover.Trigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded py-1 pl-4 text-sm font-medium ring-accent-7 ring-offset-gray-1 transition-colors hover:bg-gray-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-8 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <div>
            <div>{thread.title ?? 'new thread'}</div>
            <div className="font-normal text-gray-11">{currentModel.name}</div>
          </div>
          <ChevronsUpDownIcon className="ml-1 shrink-0 text-gray-10" />
        </button>
      </Popover.Trigger>

      <Popover.Content align="center" sideOffset={5} className="w-80">
        <Command>
          <CommandInput value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {!page && (
              <>
                <CommandGroup heading={`Actions: ${thread.title ?? 'new thread'}`}>
                  <CommandItem onSelect={() => setDialog('updateTitle')}>
                    <PencilIcon className="mr-2 size-4" />
                    Edit Title
                  </CommandItem>
                  <CommandItem onSelect={() => setDialog('deleteThread')}>
                    <Trash2Icon className="mr-2 size-4" />
                    Delete Thread
                  </CommandItem>
                  <CommandItem onSelect={() => setPage('chatModels')}>
                    <BoxIcon className="mr-2 size-4" />
                    <div className="line-clamp-1 grow">{currentModel.name}</div>
                    <div className="text-xs text-gray-10">change</div>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </Popover.Content>

      {dialog === 'updateTitle' && (
        <UpdateThreadTitleDialog thread={thread} defaultOpen onClose={() => setDialog('')} />
      )}
      {dialog === 'deleteThread' && (
        <DeleteThreadDialog
          threadId={thread.slug}
          defaultOpen
          // onSuccess={() => multi.remove(thread.slug)}
          onClose={() => setDialog('')}
        />
      )}
    </Popover.Root>
  )
}
